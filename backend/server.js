require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const factcheckRouter = require('./src/routes/factcheck');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// CORS — allow both local dev and deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in dev; tighten for production
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'FactFinder API is live' });
});

// Routes
app.use('/api', factcheckRouter);

// Global error handler
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('[WARNING] MONGODB_URI not set. Running without database persistence.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.warn('[WARNING] Failed to connect to MongoDB:', error.message);
    console.warn('App will continue running without database persistence.');
  }
};

connectDB();

// Start server with retry logic
const PORT = process.env.PORT || 5000;
let server;
let retries = 0;
const maxRetries = 3;

const startServer = (port) => {
  try {
    server = app.listen(port, () => {
      console.log(`✓ FactGuard API running on port ${port}`);
      retries = 0; // Reset on success
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`[Server] Port ${port} is in use, trying ${port + 1}...`);
        if (retries < maxRetries) {
          retries++;
          startServer(port + 1);
        } else {
          console.error('[Server] Failed to find available port after retries');
          process.exit(1);
        }
      } else {
        throw error;
      }
    });
  } catch (error) {
    console.error('[Server] Error starting server:', error);
    process.exit(1);
  }
};

startServer(PORT);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, closing server gracefully');
  if (server) {
    server.close(() => {
      console.log('[Server] Server closed');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received, closing server gracefully');
  if (server) {
    server.close(() => {
      console.log('[Server] Server closed');
      process.exit(0);
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});
