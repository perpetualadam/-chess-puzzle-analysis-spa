# ⚡ Quick Start Guide

Get your Chess PWA running in 3 minutes!

## Step 1: Generate Icons (2 minutes)

Your browser should have opened `generate-icons.html` automatically.

If not, open it manually:
```
http://localhost:8080/generate-icons.html
```

**What to do:**
1. Icons are auto-generated on the page
2. Click "Download" under each icon size (10 icons total)
3. Save all icons to the `/icons/` folder in your project

**Icon sizes needed:**
- 16x16, 32x32 (favicons)
- 72x72, 96x96, 128x128, 144x144, 152x152 (mobile)
- 192x192, 384x384, 512x512 (high-res)

## Step 2: Verify PWA Setup (30 seconds)

Open the test page:
```
http://localhost:8080/pwa-test.html
```

**All tests should PASS:**
- ✅ Service Worker Support
- ✅ Service Worker Registered
- ✅ Manifest File
- ✅ Icons Exist
- ✅ HTTPS or Localhost

If any fail, check the console for errors.

## Step 3: Use the App! (30 seconds)

Open the main app:
```
http://localhost:8080/
```

**Try these features:**

### Puzzle Mode
1. Click "New Puzzle"
2. Drag a piece to make a move
3. Watch the opponent respond automatically!
4. Notice the board might be flipped (you're playing as Black)

### Analysis Mode
1. Click "Analysis Mode" tab
2. Click "Load PGN" → type `opera-1858` → OK
3. Click "Analyze Game"
4. Watch the pieces animate as Stockfish analyzes!
5. Use navigation buttons (|< < > >|) to step through moves
6. Check the captured pieces display and material advantage

## Step 4: Install as PWA (1 minute)

### On Desktop (Chrome/Edge)
Look for the **install icon (⊕)** in the address bar → Click it → Install

### On Mobile
Deploy to a server with HTTPS first (see deployment options below).

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Easiest)
```bash
git init
git add .
git commit -m "Chess PWA"
git remote add origin https://github.com/YOUR_USERNAME/chess-pwa.git
git push -u origin main
```
Then enable GitHub Pages in repo settings.

### Option 2: Netlify (Fastest)
1. Go to https://app.netlify.com/drop
2. Drag your project folder
3. Done! You get a HTTPS URL instantly

### Option 3: Vercel
```bash
npm i -g vercel
vercel
```

## ✅ Success Checklist

- [ ] Icons generated and saved to `/icons/` folder
- [ ] PWA test page shows all tests passing
- [ ] App loads at http://localhost:8080
- [ ] Puzzle mode works (pieces move, opponent responds)
- [ ] Analysis mode works (game animates, navigation works)
- [ ] Service worker registered (check browser console)
- [ ] Install prompt appears (desktop)

## 🐛 Common Issues

### "Icons not found" error
→ Make sure you downloaded all 10 icons to `/icons/` folder

### Service worker not registering
→ Check browser console for errors
→ Make sure you're on localhost or HTTPS

### Install prompt not showing
→ All PWA criteria must be met (manifest, SW, icons)
→ Try in Chrome/Edge first
→ May require HTTPS (not localhost)

## 🎉 You're Done!

Your Chess PWA is ready to use!

**Next steps:**
- Share with friends
- Deploy to production
- Customize the icons
- Add more puzzles

**Need help?** Check:
- `README.md` - Full documentation
- `PWA-SETUP.md` - Detailed PWA guide
- `pwa-test.html` - Diagnostic tool

Enjoy! ♟️

