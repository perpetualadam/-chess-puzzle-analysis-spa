/*
  Stockfish Web Worker loader
  Notes:
  - Loads Stockfish.js version 10 (pure JavaScript, proven stable)
  - This is an older but very reliable version that works everywhere
  - For offline use, download stockfish files and place under /vendor
*/

// Use Stockfish.js version 10 from cdnjs (proven stable, ~6MB)
importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

// Initialize Stockfish engine
const engine = typeof STOCKFISH === 'function' ? STOCKFISH() : (typeof Stockfish === 'function' ? Stockfish() : null);

if (!engine) {
  postMessage('error: Stockfish failed to initialize');
} else {
  // Forward messages from main thread to engine
  onmessage = function(e) {
    engine.postMessage(e.data);
  };

  // Forward messages from engine to main thread
  engine.onmessage = function(line) {
    const msg = (typeof line === 'object' && 'data' in line) ? String(line.data) : String(line);
    postMessage(msg);
  };
}
