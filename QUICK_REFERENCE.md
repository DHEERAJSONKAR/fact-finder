# 🚀 Quick Reference Card

## What's New? 
Modern light theme + 6 powerful new features

## ⚡ Quick Commands

### Start Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Access Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🆕 6 New Features

### 1️⃣ Export & Share
- **JSON Export** - Download full report data
- **CSV Export** - Open in spreadsheets
- **Share Link** - Copy or share with others
**Location**: Click "Export & Share" button in results

### 2️⃣ Theme Toggle
- **Light/Dark** - Switch themes anytime
- **Auto-Save** - Preference remembered
**Location**: Moon/Sun icon (top-right corner)

### 3️⃣ Processing Steps
- **5-Step Visualization** - See analysis progress
- **Real-time Updates** - Watch each step complete
**Location**: Shows during PDF analysis

### 4️⃣ Bookmark Claims ⭐
- **Save Important** - Star any claim
- **View Saved** - See all bookmarks
- **Persistent** - Saves automatically
**Location**: Star icon on each claim card

### 5️⃣ Key Insights 💡
- **Accuracy Score** - Overall verification quality
- **Risk Level** - Identifies problematic claims
- **Evidence Quality** - % of claims with sources
- **Verification Stats** - At a glance metrics
**Location**: Below dashboard stats in results

### 6️⃣ Advanced Filters
- **Status Filter** - Verified, False, Inaccurate, etc.
- **Source Filter** - With or without sources
- **Length Filter** - By claim character count
**Location**: Results section (ready to integrate)

## 🎨 Visual Changes

### Colors
- Primary: Sky Blue (#0EA5E9) instead of Indigo
- Background: Light (#F8FAFC) instead of Dark
- Text: Dark slate for readability
- Status: Green/Amber/Red/Gray (light theme)

### Theme
- Light theme active by default
- Dark theme available via toggle
- Saves your preference

## 📊 Dashboard Components

```
┌─────────────────────────────────┐
│  Header with Theme Toggle       │
├─────────────────────────────────┤
│  File Upload Zone               │
├─────────────────────────────────┤
│  Processing Steps (during run)  │
├─────────────────────────────────┤
│  Dashboard Stats                │
├─────────────────────────────────┤
│  Key Insights                   │
├─────────────────────────────────┤
│  Claims with Bookmarks          │
├─────────────────────────────────┤
│  Export & Share Button          │
└─────────────────────────────────┘
```

## 💾 Save Your Work

### Bookmarked Claims
- Automatically saved to browser storage
- Persist across page refreshes
- View in "Saved (X)" dropdown

### Theme Preference
- Automatically saved to browser storage
- Persists across browser restarts
- One-click toggle

### Exported Reports
- JSON files for programming
- CSV files for spreadsheets
- Shared links for collaboration

## 🔧 Configuration

### Change API
Edit `frontend/.env.local`:
```env
VITE_API_URL=http://your-backend-url:5000
```

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  brand: {
    primary: '#0EA5E9',  // Change this
  }
}
```

### Change Timeout
Edit `frontend/src/App.jsx`:
```javascript
timeout: 180000,  // in milliseconds
```

## 📱 Mobile Support

✅ Fully responsive design
✅ Touch-friendly buttons
✅ Mobile-optimized modals
✅ Fast loading

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect to backend | Make sure `npm run dev` running in backend/ |
| API rate limit error | Wait 60 seconds and try again |
| No claims extracted | Try different PDF with more facts |
| Theme not saving | Clear browser cache |
| PDF won't parse | Make sure PDF has extractable text |

## 📚 Documentation

- **FEATURES.md** - Full feature overview
- **GETTING_STARTED.md** - Setup and usage guide
- **CHANGELOG.md** - All changes detailed
- **PROJECT_SUMMARY.md** - Complete project info

## 🎯 How to Use Each Feature

### Export a Report
1. Analyze PDF
2. Click "Export & Share"
3. Choose format (JSON/CSV/Share)
4. Download or share

### Bookmark Claims
1. Click ⭐ on any claim
2. See count increase: "Saved (X)"
3. Click to view all bookmarks
4. Click X to remove

### Change Theme
1. Click 🌙/☀️ (top-right)
2. Theme changes instantly
3. Preference saved

### Check Insights
1. Scroll to Key Insights section
2. View 4 metric cards
3. See accuracy, risk, evidence stats

### Track Progress
1. Upload PDF
2. Watch 5 processing steps
3. Each step shows progress bar
4. See completion checkmark

## 📈 Performance Tips

- Use PDFs with extractable text
- Smaller files analyze faster
- Check API rate limits if stuck
- Dark mode better for night work
- Export helps with analysis

## 🔐 Security & Privacy

✅ Data processed securely
✅ Bookmarks stored locally (not uploaded)
✅ Theme preference local only
✅ Exports don't store data
✅ No tracking or analytics

## 🎓 Learning Resources

- View `GETTING_STARTED.md` for API setup
- Check `FEATURES.md` for feature details
- Read `CHANGELOG.md` for technical changes
- Browse component code for patterns

## 🌟 Pro Tips

1. **Bookmark** important false claims
2. **Export CSV** for analysis in Excel
3. **Toggle theme** based on lighting
4. **Check insights** before sharing
5. **Share link** to collaborate

## 📞 Need Help?

1. Check relevant documentation file
2. Review error message for clues
3. Try different PDF
4. Check API keys are set
5. Verify backend is running

## ✅ Testing Checklist

- [ ] Upload PDF
- [ ] Watch processing steps
- [ ] Bookmark a claim
- [ ] View bookmarks dropdown
- [ ] Export as JSON
- [ ] Export as CSV
- [ ] Share report
- [ ] Toggle theme
- [ ] Check mobile view
- [ ] Review Key Insights

## 🚀 Next Steps

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. Upload test PDF
5. Explore all new features!

---

**You're ready to use FactGuard with all new features! 🎉**

Last updated: 2024
