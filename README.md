# ♟️ Chess Puzzle & Analysis PWA

A professional Progressive Web App for chess puzzle training and game analysis, powered by Stockfish engine.

## 🎯 Features

### 🧩 Puzzle Mode
- **Multiple Game Modes**: Rated, Custom, Daily, Rush, Battle
- **50+ Authentic Puzzles**: Diverse themes and difficulty levels (400-2500+ rating)
- **Special Moves Support**: En passant, castling, promotion
- **Randomized Colors**: Play as White or Black with automatic board flip
- **Multi-Move Sequences**: Automatic opponent responses for realistic tactical training
- **Visual Feedback**: Color-coded arrows for player (green) and opponent (red) moves
- **Scoring System**: Rating, streak, and level tracking
- **Timer Mode**: Optional countdown timer
- **CSV/PGN Import**: Import puzzles from Lichess or custom sources

### 📊 Analysis Mode
- **Stockfish Integration**: Professional-grade chess engine analysis
- **Animated Playback**: Watch moves play out in real-time during analysis
- **Full Navigation**: Step through games move-by-move (first/prev/next/last)
- **Captured Pieces Display**: Visual material tracking with advantage indicator
- **Evaluation Chart**: Line graph showing position evaluation over time
- **Blunder Detection**: Automatically identifies mistakes (swings ≥ 2.00 pawns)
- **PGN Support**: Load and analyze games from Hall of Fame or manual input
- **Export**: Save annotated PGN with analysis

### 🏛️ Hall of Fame
- Famous historical games library
- One-click loading into Analysis Mode
- Includes: Opera Game, Immortal Game, Evergreen, Deep Blue vs Kasparov, and more

### 📱 PWA Features
- **Offline Support**: Works without internet after first load
- **Installable**: Add to home screen on mobile and desktop
- **Fast Loading**: Cached resources for instant startup
- **Auto-Updates**: Prompts when new version available
- **Cross-Platform**: iOS, Android, Windows, Mac, Linux

## 🚀 Quick Start

### 1. Generate Icons (First Time Only)

Open the icon generator in your browser:
```
http://localhost:8080/generate-icons.html
```

Click "Download" under each icon size and save to `/icons/` folder.

**Alternative methods:**
- Run `python generate-icons.py` (requires: `pip install pillow cairosvg`)
- Run `node generate-icons.js` (requires: `npm install canvas`)
- Double-click `generate-icons.bat` (Windows)

### 2. Start the App

```bash
python -m http.server 8080
```

Then open: http://localhost:8080

### 3. Install as PWA

**Desktop (Chrome/Edge):**
- Look for install icon (⊕) in address bar
- Click to install

**Mobile (Android):**
- Menu (⋮) → "Add to Home Screen"

**Mobile (iOS):**
- Share button → "Add to Home Screen"

## 📁 Project Structure

```
chess-puzzle/
├── index.html              # Main app
├── styles.css              # Styling
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── js/
│   ├── app.js             # Main app logic
│   ├── puzzle.js          # Puzzle mode
│   ├── analysis.js        # Analysis mode
│   ├── halloffame.js      # Game library
│   ├── importer.js        # CSV/PGN import
│   ├── storage.js         # localStorage wrapper
│   └── engine.js          # Stockfish wrapper
├── data/
│   ├── puzzles.js         # Puzzle database
│   └── games.js           # Famous games
├── icons/                 # PWA icons
├── lib/                   # Stockfish engine
├── generate-icons.html    # Browser icon generator
├── generate-icons.py      # Python icon generator
├── generate-icons.js      # Node.js icon generator
├── pwa-test.html         # PWA testing page
└── PWA-SETUP.md          # Detailed PWA guide
```

## 🧪 Testing

### Test PWA Functionality
Open: http://localhost:8080/pwa-test.html

This page checks:
- ✅ Service Worker registration
- ✅ Manifest file
- ✅ Icons availability
- ✅ Cache status
- ✅ HTTPS/localhost

### Test Offline Mode
1. Load the app once while online
2. Open DevTools → Network tab
3. Check "Offline" checkbox
4. Reload the page
5. App should still work!

## 🎮 Usage

### Puzzle Mode
1. Click "Puzzle Mode" tab
2. Choose mode: Rated, Custom, Daily, Rush, or Battle
3. Drag pieces to make moves
4. Get instant feedback with Stockfish analysis
5. Watch opponent respond automatically
6. Continue the tactical sequence until completion

### Analysis Mode
1. Click "Analysis Mode" tab
2. Click "Load PGN" and select a game from Hall of Fame
3. Click "Analyze Game"
4. Watch the game animate with real-time analysis
5. Use navigation buttons to step through moves
6. View captured pieces and material advantage
7. Check evaluation chart and blunder detection

## 🛠️ Technologies

- **Chess Logic**: Chess.js v0.10.3
- **Board UI**: Chessboard.js v1.0.0
- **Engine**: Stockfish.js v10.0.2
- **Charts**: Chart.js v3.9.1
- **Storage**: localStorage API
- **PWA**: Service Workers, Web App Manifest

## 📦 Deployment

### GitHub Pages (Free)
```bash
git init
git add .
git commit -m "Chess PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chess-pwa.git
git push -u origin main
```

Enable GitHub Pages in repository settings.

### Other Options
- **Netlify**: Drag and drop deployment
- **Vercel**: `vercel deploy`
- **Cloudflare Pages**: Git integration

All provide free HTTPS hosting for PWAs.

## 📝 License

MIT License - Feel free to use and modify!

## 🙏 Credits

- Chess engine: Stockfish
- Chess logic: Chess.js by Jeff Hlywa
- Board UI: Chessboard.js by Chris Oakman
- Historical games: Public domain
- Puzzles: Curated from famous games and tactical patterns

## 🎉 Enjoy!

Happy puzzling and analyzing! ♟️

