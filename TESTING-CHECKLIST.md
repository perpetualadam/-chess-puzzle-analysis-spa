# 🧪 Chess App Testing Checklist

## Automated Tests
- [ ] Run `http://localhost:8080/test-functionality.html` - All tests should pass
- [ ] Run `http://localhost:8080/pwa-test.html` - All 5 PWA tests should pass

---

## 1. Puzzle Mode Testing

### Basic Functionality
- [ ] Click "New Puzzle" - Board loads with a position
- [ ] Make a correct move - Green arrow appears, success message shows
- [ ] Make an incorrect move - Red arrow appears, error message shows
- [ ] Click "Hint" - Engine shows best moves
- [ ] Click "Solution" - Solution is revealed

### Puzzle Modes
- [ ] **Rated Puzzles** - Rating changes after solving/failing
- [ ] **Custom Practice** - Filters work (theme, rating range)
- [ ] **Daily Puzzle** - Loads a daily puzzle
- [ ] **Puzzle Rush** - 3-minute timer, 3 strikes, score tracking
- [ ] **Puzzle Battle** - Player vs AI scoring works

### Special Moves
- [ ] **Castling** - Can castle when it's the solution
- [ ] **En Passant** - En passant captures work
- [ ] **Promotion** - Pawn promotion dialog appears

### Multi-Move Sequences
- [ ] After correct move, opponent responds automatically (400ms delay)
- [ ] Sequence continues until puzzle is solved
- [ ] Green arrows for player, red arrows for opponent

### Randomized Colors
- [ ] Sometimes play as White (board normal)
- [ ] Sometimes play as Black (board flipped)
- [ ] Opponent makes first move when playing as Black

### Timer & Scoring
- [ ] Toggle "Timed" - Timer appears and counts down
- [ ] Toggle "Scoring" - Rating changes enabled/disabled
- [ ] Timer expires - Puzzle fails
- [ ] Streak increases on consecutive solves
- [ ] Level increases based on rating

---

## 2. Analysis Mode Testing

### Loading Games
- [ ] Click "Load PGN" - Can paste PGN text
- [ ] Load from Hall of Fame - Enter game ID (e.g., "opera-1858")
- [ ] Invalid PGN - Shows error message

### Game Analysis
- [ ] Click "Analyze Game" - Stockfish analyzes each move
- [ ] Moves animate during analysis (100ms per move)
- [ ] Move indicator updates (e.g., "15/33")
- [ ] Evaluation chart appears
- [ ] Mistakes/blunders are detected and highlighted

### Navigation Controls
- [ ] Click `|<` (First Move) - Jumps to starting position
- [ ] Click `<` (Previous) - Steps back one move
- [ ] Click `>` (Next) - Steps forward one move
- [ ] Click `>|` (Last Move) - Jumps to final position
- [ ] Move indicator shows current position

### Captured Pieces
- [ ] Captured pieces display for both sides
- [ ] Material count shows (e.g., "+3" for White)
- [ ] Material advantage indicator shows who's ahead

### Export
- [ ] Click "Export Annotated PGN" - Downloads PGN with analysis

---

## 3. Hall of Fame Testing

### Game Library
- [ ] Hall of Fame shows list of famous games
- [ ] Each game shows: Title, Players, Year, Description
- [ ] Click "Load in Analysis" - Game loads in Analysis Mode

### Famous Games Included
- [ ] Opera Game (Morphy, 1858)
- [ ] Immortal Game (Anderssen, 1851)
- [ ] Evergreen Game (Anderssen, 1852)
- [ ] Game of the Century (Fischer, 1956)
- [ ] And more...

---

## 4. Chess Engine (Stockfish) Testing

### Engine Controls
- [ ] Click "Start Engine" - Engine starts analyzing
- [ ] Engine shows multiple lines (MultiPV)
- [ ] Evaluation updates in real-time
- [ ] Click "Stop" - Engine stops

### Engine Accuracy
- [ ] **Mate in 1** - Engine finds checkmate instantly
  - Test position: `6k1/5ppp/8/8/8/8/5PPP/Q5K1 w - - 0 1`
  - Solution: `Qa8#`
- [ ] **Mate in 2** - Engine finds forced mate
  - Test position: `r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1`
  - Solution: `Qxf7+` then `Qxe8#`
- [ ] **Tactical positions** - Engine finds best moves
- [ ] **Evaluation** - Shows positive for White advantage, negative for Black

### Depth & MultiPV
- [ ] Adjust "Depth" slider - Engine searches deeper
- [ ] Adjust "MultiPV" slider - Shows 1-3 best lines
- [ ] Higher depth = more accurate but slower

---

## 5. Settings Testing

### Board Settings
- [ ] Change "Board Theme" - Board colors change
- [ ] Change "Piece Set" - Piece images change

### Engine Settings
- [ ] Change "Engine Depth" - Affects analysis depth
- [ ] Change "MultiPV" - Affects number of lines shown

### Puzzle Settings
- [ ] Toggle "Enable Timed Puzzles" - Timer appears
- [ ] Change "Timer Seconds" - Timer duration changes
- [ ] Toggle "Enable Scoring" - Rating changes on/off
- [ ] Click "Save" - Settings persist after reload

---

## 6. Import/Export Testing

### Import Puzzles
- [ ] Click "Choose File" - Select CSV/PGN file
- [ ] Click "Import Puzzles" - Puzzles are imported
- [ ] Click "Use Imported Puzzles" - Imported puzzles appear in Custom mode
- [ ] Check "Include Imported" filter - Imported puzzles included

### Export PGN
- [ ] Analyze a game
- [ ] Click "Export Annotated PGN" - Downloads PGN file
- [ ] Open PGN in text editor - Contains moves and annotations

---

## 7. UI/UX Testing

### Navigation
- [ ] Click "Puzzle Mode" - Switches to Puzzle Mode
- [ ] Click "Analysis Mode" - Switches to Analysis Mode
- [ ] Click "Hall of Fame" - Switches to Hall of Fame
- [ ] Active tab is highlighted

### Mobile Responsiveness
- [ ] Resize browser to mobile width - Layout adapts
- [ ] Board resizes correctly
- [ ] Buttons are touch-friendly
- [ ] Sidebar collapses on mobile
- [ ] Click menu button (☰) - Sidebar toggles

### Tabs (Lines/Chart)
- [ ] Click "Lines" tab - Shows engine lines
- [ ] Click "Chart" tab - Shows evaluation chart
- [ ] Active tab is highlighted

---

## 8. PWA Testing

### Installation
- [ ] Install icon (⊕) appears in address bar
- [ ] Click install - App installs
- [ ] App opens in standalone window
- [ ] App icon appears on desktop/home screen

### Offline Mode
- [ ] Open DevTools → Application → Service Workers
- [ ] Check "Offline" checkbox
- [ ] Reload page - App still works
- [ ] Puzzles work offline
- [ ] Analysis works offline (Stockfish runs locally)

### Updates
- [ ] Update app code
- [ ] Reload page - Update prompt appears
- [ ] Click "Reload" - App updates

### Icons & Manifest
- [ ] Favicon appears in browser tab
- [ ] App icon appears when installed
- [ ] Theme color matches app (green: #3fb959)

---

## 9. Performance Testing

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Puzzle loads instantly
- [ ] Analysis starts within 1 second
- [ ] Board animations are smooth

### Engine Performance
- [ ] Engine analyzes mate-in-1 instantly
- [ ] Engine analyzes complex positions within 5 seconds (depth 14)
- [ ] No lag when making moves

### Memory
- [ ] No memory leaks after 50+ puzzles
- [ ] No slowdown after long analysis sessions

---

## 10. Error Handling

### Invalid Input
- [ ] Invalid PGN - Shows error message
- [ ] Invalid FEN - Shows error message
- [ ] Illegal move - Move is rejected

### Edge Cases
- [ ] Checkmate position - Analysis doesn't hang
- [ ] Stalemate position - Detected correctly
- [ ] Empty board - Handled gracefully

---

## ✅ All Tests Passing?

If all tests pass:
- ✅ All buttons are functional
- ✅ Chess engine is accurate
- ✅ All features work as expected
- ✅ PWA is fully functional
- ✅ Ready for deployment!

If any tests fail, note the issue and fix before deploying.

