# 🚀 Getting Started with FactGuard - Light Theme Edition

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ (for backend)
- PDF files with extractable text

### Installation

#### 1. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173`

#### 2. **Backend Setup**
```bash
cd backend
npm install
```

#### 3. **Environment Variables**
Create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
PORT=5000
NODE_ENV=development
```

Get API keys:
- **Groq**: https://console.groq.com/keys
- **Tavily**: https://tavily.com/api

#### 4. **Start Backend**
```bash
npm run dev
```
Backend will run on `http://localhost:5000`

---

## 🎨 New Features Overview

### 1. **Light Theme** ✨
- Modern, clean interface with blue and cyan accents
- Automatically saved theme preference
- Toggle between light/dark modes anytime

### 2. **Export & Share** 📤
- Export reports as **JSON** (full data)
- Export as **CSV** (spreadsheet format)
- Share reports via link or native sharing

### 3. **Processing Steps** 🔄
- Real-time visualization of analysis progress
- 5 steps: Parse PDF → Extract Claims → Web Search → Verify → Generate Report
- Animated progress indicators

### 4. **Bookmarked Claims** ⭐
- Save important claims with star icon
- View all bookmarks in one place
- Persistent storage via browser localStorage

### 5. **Key Insights** 💡
- Quick analytics overview
- Accuracy score, risk level, evidence quality
- Verified claims percentage

### 6. **Advanced Status Badges** 🏷️
- Color-coded verification status
- Animated icons and transitions
- Easy-to-scan claim cards

### 7. **Beautiful Error Handling** 🛡️
- Clear error messages
- Troubleshooting tips
- Helpful solution suggestions

---

## 📊 Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **ExportMenu** | Export & share functionality | Header/Results area |
| **ThemeToggle** | Light/dark mode toggle | Top-right corner |
| **ProcessingSteps** | Progress visualization | During analysis |
| **StarredClaims** | Bookmark management | Results section |
| **KeyInsights** | Analytics dashboard | Below DashboardStats |
| **AdvancedFilters** | (Future) Advanced filtering | ResultsTable |

---

## 🎯 How to Use

### Analyzing a PDF
1. **Upload PDF** → Drag-and-drop or click to select
2. **Wait for Analysis** → Watch processing steps complete
3. **Review Results** → See all verified claims
4. **Bookmark Important Claims** → Click star icon
5. **Export Report** → Download as JSON/CSV or share

### Bookmarking Claims
1. Click ⭐ icon on any claim card
2. View all bookmarks in "Saved" button
3. Click X to remove from bookmarks

### Changing Theme
1. Click 🌙/☀️ button in top-right corner
2. Theme preference is saved automatically
3. Persists across sessions

### Exporting Data
1. Click "Export & Share" button
2. Choose format:
   - **JSON**: For developers, APIs, advanced analysis
   - **CSV**: For spreadsheets, databases, reports
   - **Share**: Copy link or use native sharing

---

## 🔧 Configuration

### Change Primary Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  brand: {
    primary: '#0EA5E9',    // Change this
    dark: '#0284C7',       // Or this
    light: '#38BDF8',      // Or this
  }
}
```

### Change API Timeout
Edit `frontend/src/App.jsx`:
```javascript
timeout: 180000,  // 3 minutes (in milliseconds)
```

### Change Backend URL
Create `frontend/.env.local`:
```env
VITE_API_URL=http://your-backend-url:5000
```

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
```bash
# Make sure backend is running
cd backend
npm run dev

# Check PORT is not already in use
lsof -i :5000
```

### "API rate limit exceeded"
- **Solution**: Wait 60 seconds and try again
- **Prevention**: Upgrade your Groq/Tavily API plan

### "PDF parsing failed"
- Make sure PDF is text-based (not scanned image)
- Try a different PDF file
- Check file is not corrupted

### "No claims extracted"
- PDF might not have factual claims
- Try a PDF with statistics, dates, quotes, or assertions
- PDF should have at least 100 words

### Theme not persisting
- Clear browser cache/cookies
- Check localStorage is enabled
- Try a different browser

---

## 📱 Browser Support

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Full support |
| Safari | ✅ Full | iOS 13+ |
| Edge | ✅ Full | Full support |
| IE 11 | ❌ None | Not supported |

---

## 🔒 Privacy & Security

- **Local Processing**: Theme/bookmarks stored locally
- **No Tracking**: No analytics or user tracking
- **API Keys**: Keep backend/.env secret
- **PDF Content**: Sent to APIs for verification only
- **Encryption**: Use HTTPS in production

---

## 📚 API Reference

### Upload & Analyze PDF
```bash
curl -X POST http://localhost:5000/api/factcheck \
  -F "file=@document.pdf"
```

Response:
```json
{
  "filename": "document.pdf",
  "total_claims": 5,
  "verified": 3,
  "inaccurate": 1,
  "false_count": 1,
  "accuracy_score": 80,
  "claims": [
    {
      "claim": "Climate change is real",
      "status": "Verified",
      "explanation": "...",
      "correct_fact": "...",
      "source": "https://..."
    }
  ]
}
```

---

## 🎨 Customization

### Add Custom Status Colors
Edit `frontend/src/components/StatusBadge.jsx`:
```javascript
const statusConfig = {
  'Custom': {
    bg: 'bg-custom-100',
    text: 'text-custom-700',
  }
}
```

### Add Custom Filter Options
Edit `frontend/src/components/AdvancedFilters.jsx`:
```javascript
const handleFilterChange = (key, value) => {
  // Add custom filter logic
}
```

### Add Custom Export Formats
Edit `frontend/src/components/ExportMenu.jsx`:
```javascript
const exportAsXML = () => {
  // Add XML export logic
}
```

---

## 🚀 Deployment

### Deploy Frontend
```bash
# Build
npm run build

# Deploy to Vercel, Netlify, etc.
# Files in frontend/dist/
```

### Deploy Backend
```bash
# Using Render (in render.yaml)
# Using Heroku, Railway, etc.
# Make sure to set GROQ_API_KEY, TAVILY_API_KEY
```

### Environment Variables (Production)
```env
GROQ_API_KEY=****
TAVILY_API_KEY=****
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
```

---

## 📞 Support & Issues

- GitHub Issues: Report bugs or request features
- Email: support@factguard.example.com
- Discord: Join community for discussions

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 🙏 Credits

Built with:
- ⚛️ React 18
- 🎨 Tailwind CSS 3
- 🎬 Framer Motion
- 📡 Axios
- 🤖 Groq LLM API
- 🔍 Tavily Search API
- 📄 PDF-Parse

---

**Made with ❤️ for Truth & Transparency**

Last Updated: 2024
