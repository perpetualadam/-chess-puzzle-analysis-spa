(function(){
  const chess = new Chess();
  let engine, chart, evalSeries = [];
  let analyzedMoves = []; // Store all moves for navigation
  let currentMoveIndex = 0; // Current position in the game

  function $(s){ return document.querySelector(s); }

  // Piece values for material calculation
  const PIECE_VALUES = {
    'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0,
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0
  };

  // Piece image URLs (using chessboardjs.com CDN)
  const PIECE_IMAGES = {
    'p': 'https://chessboardjs.com/img/chesspieces/wikipedia/bP.png',
    'n': 'https://chessboardjs.com/img/chesspieces/wikipedia/bN.png',
    'b': 'https://chessboardjs.com/img/chesspieces/wikipedia/bB.png',
    'r': 'https://chessboardjs.com/img/chesspieces/wikipedia/bR.png',
    'q': 'https://chessboardjs.com/img/chesspieces/wikipedia/bQ.png',
    'P': 'https://chessboardjs.com/img/chesspieces/wikipedia/wP.png',
    'N': 'https://chessboardjs.com/img/chesspieces/wikipedia/wN.png',
    'B': 'https://chessboardjs.com/img/chesspieces/wikipedia/wB.png',
    'R': 'https://chessboardjs.com/img/chesspieces/wikipedia/wR.png',
    'Q': 'https://chessboardjs.com/img/chesspieces/wikipedia/wQ.png'
  };

  function setupChart(){
    const ctx = document.getElementById('eval-chart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line', data: { labels: [], datasets: [{ label: 'Eval (cp)', data: [], borderColor: '#3fb950', fill: false, tension: 0.2 }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { suggestedMin: -500, suggestedMax: 500 } } }
    });
  }

  function updateEvalBar(score){
    const ptr = document.getElementById('eval-pointer');
    let cp = 0;
    if(score){ cp = (score.type==='cp') ? score.value : (score.value>0? 1000 : -1000); }
    const pct = Math.max(0, Math.min(100, 50 - (cp/10))); // crude map
    ptr.style.top = `${pct}%`;
  }

  function updateCapturedPieces() {
    // Get current position
    const currentFEN = chess.fen();

    // Count pieces in starting position
    const startingPieces = {
      'P': 8, 'N': 2, 'B': 2, 'R': 2, 'Q': 1, 'K': 1,
      'p': 8, 'n': 2, 'b': 2, 'r': 2, 'q': 1, 'k': 1
    };

    // Count pieces in current position
    const currentPieces = {};
    const fenParts = currentFEN.split(' ')[0]; // Get board part of FEN

    for(const char of fenParts) {
      if(char.match(/[pnbrqkPNBRQK]/)) {
        currentPieces[char] = (currentPieces[char] || 0) + 1;
      }
    }

    // Calculate captured pieces
    const capturedByWhite = []; // Black pieces captured by white
    const capturedByBlack = []; // White pieces captured by black

    for(const piece in startingPieces) {
      const missing = startingPieces[piece] - (currentPieces[piece] || 0);
      for(let i = 0; i < missing; i++) {
        if(piece === piece.toLowerCase()) {
          // Black piece captured by white
          capturedByWhite.push(piece);
        } else {
          // White piece captured by black
          capturedByBlack.push(piece);
        }
      }
    }

    // Sort pieces by value (highest first)
    const sortByValue = (a, b) => PIECE_VALUES[b] - PIECE_VALUES[a];
    capturedByWhite.sort(sortByValue);
    capturedByBlack.sort(sortByValue);

    // Calculate material
    const whiteMaterial = capturedByWhite.reduce((sum, p) => sum + PIECE_VALUES[p], 0);
    const blackMaterial = capturedByBlack.reduce((sum, p) => sum + PIECE_VALUES[p], 0);
    const materialDiff = whiteMaterial - blackMaterial;

    // Display captured pieces
    const whiteCapturedDiv = $('#white-captured');
    const blackCapturedDiv = $('#black-captured');

    whiteCapturedDiv.innerHTML = capturedByWhite.map(p =>
      `<div class="captured-piece" style="background-image: url('${PIECE_IMAGES[p]}')"></div>`
    ).join('');

    blackCapturedDiv.innerHTML = capturedByBlack.map(p =>
      `<div class="captured-piece" style="background-image: url('${PIECE_IMAGES[p]}')"></div>`
    ).join('');

    // Display material count
    $('#white-material').textContent = whiteMaterial > 0 ? `+${whiteMaterial}` : '';
    $('#black-material').textContent = blackMaterial > 0 ? `+${blackMaterial}` : '';

    // Display material advantage
    const advantageDiv = $('#material-advantage');
    if(materialDiff > 0) {
      advantageDiv.textContent = `White +${materialDiff}`;
      advantageDiv.className = 'white-advantage';
    } else if(materialDiff < 0) {
      advantageDiv.textContent = `Black +${Math.abs(materialDiff)}`;
      advantageDiv.className = 'black-advantage';
    } else {
      advantageDiv.textContent = 'Equal';
      advantageDiv.className = 'equal';
    }
  }

  function setBoardFEN(fen){
    // Use the puzzle board since it's the actual active board
    const board = window.__PUZZLE_BOARD__ || window.__BOARD__;
    if(board){
      board.position(fen, false);
      updateCapturedPieces(); // Update captured pieces display
    } else {
      console.error('[Analysis] Board object not found!');
    }
  }

  function navUpdate(){
    const total = analyzedMoves.length;
    $('#move-indicator').textContent = `${currentMoveIndex}/${total}`;
  }

  function goToMove(index) {
    if(index < 0 || index > analyzedMoves.length) return;

    currentMoveIndex = index;
    chess.reset();

    // Replay moves up to the current index
    for(let i = 0; i < index; i++) {
      chess.move(analyzedMoves[i]);
    }

    setBoardFEN(chess.fen());
    navUpdate();
  }

  async function analyzeCurrentPosition(){
    const depth = +($('#engine-depth').value || 14);
    const multipv = +($('#engine-multipv').value || 3);
    const res = await engine.requestEval(chess.fen(), depth, multipv);
    const best = res[0];

    updateEvalBar(best?.score || null);
    $('#engine-lines').textContent = res.map(l=>`${l.multipv||1}. ${(l.score?.type==='cp')?(l.score.value/100).toFixed(2):('#'+l.score?.value)} ${l.pv?.split(/\s+/)[0]||''}`).join('\n');
    return best;
  }

  async function analyzeGame(){
    console.log('[Analysis] analyzeGame called');

    // Check if engine is ready
    if(!engine) {
      alert('Engine not initialized!');
      console.error('[Analysis] Engine is null');
      return;
    }

    // Step through the game and produce eval series + blunders
    const tmp = new Chess();
    const pgnText = $('#pgn-input').value;
    console.log('[Analysis] PGN text:', pgnText.substring(0, 100));

    try {
      tmp.load_pgn(pgnText);
    } catch(e){
      alert('Invalid PGN: ' + e.message);
      console.error('[Analysis] PGN load error:', e);
      return;
    }

    const moves = tmp.history({ verbose: true });
    console.log('[Analysis] Loaded', moves.length, 'moves');

    if(moves.length === 0) {
      alert('No moves found in PGN!');
      return;
    }

    // Store moves for navigation
    analyzedMoves = moves;
    currentMoveIndex = 0;

    chess.reset();
    evalSeries = [];
    const blunders = [];

    console.log('[Analysis] Starting analysis of', moves.length, 'moves...');
    for(let i=0;i<moves.length;i++){
      const move = moves[i];
      chess.move(move);
      currentMoveIndex = i + 1;

      // Update board to show current move with animation
      setBoardFEN(chess.fen());
      navUpdate();

      // Add small delay so user can see the move (adjust speed here)
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms per move

      // Skip engine analysis if game is over (checkmate/stalemate)
      let cp = 0;
      if(chess.game_over()) {
        // If it's checkmate, assign extreme score based on who won
        if(chess.in_checkmate()) {
          cp = (i % 2 === 0) ? 1000 : -1000; // Even index = white moved = black is mated
        }
      } else {
        const best = await analyzeCurrentPosition();
        cp = best?.score ? (best.score.type==='cp'? best.score.value : (best.score.value>0? 1000 : -1000)) : 0;
      }

      evalSeries.push(cp);
      if(i>0){ const swing = cp - evalSeries[i-1]; if(Math.abs(swing) >= 200){ blunders.push({ ply: i+1, swing, move: move.san, side: (i%2===0?'W':'B') }); } }
    }

    console.log('[Analysis] Analysis complete!');
    console.log('[Analysis] Blunders found:', blunders.length);

    // Update chart
    if(chart) {
      chart.data.labels = moves.map((_,i)=> i+1);
      chart.data.datasets[0].data = evalSeries;
      chart.update();
      console.log('[Analysis] Chart updated');
    } else {
      console.error('[Analysis] Chart is null!');
    }

    // Report blunders
    const list = blunders.map(b=> `${b.side}${b.ply}: ${b.move} (swing ${(b.swing/100).toFixed(2)})`).join('\n');
    const mistakesDiv = $('#game-mistakes');

    if(!mistakesDiv) {
      console.error('[Analysis] #game-mistakes element not found!');
    } else if(blunders.length > 0) {
      mistakesDiv.innerHTML = `<h3>Game Mistakes (swings ≥ 2.00):</h3><pre>${list}</pre>`;
    } else {
      mistakesDiv.innerHTML = `<h3>Game Mistakes:</h3><p>No major swings detected. Clean game!</p>`;
    }

    // Set to final move
    currentMoveIndex = moves.length;
    navUpdate();

    console.log('[Analysis] Analysis complete! Use navigation buttons to review the game.');
    console.log('[Analysis] Done!');
  }

  function exportAnnotatedPGN(){
    const pgn = $('#pgn-input').value;
    const blob = new Blob([pgn], { type: 'application/x-chess-pgn' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'annotated.pgn'; a.click();
    URL.revokeObjectURL(a.href);
  }

  function loadPGNFromGame(game){
    console.log('[Analysis] Loading game:', game.id);
    let pgnText = game.pgn;

    // Chess.js needs headers and moves separated by blank line
    // Format: [Header1] [Header2] ... \n\n 1.e4 e5 2.Nf3 ...
    // Find where the moves start (after the last ']')
    const lastBracket = pgnText.lastIndexOf(']');
    if(lastBracket !== -1) {
      const headers = pgnText.substring(0, lastBracket + 1);
      const moves = pgnText.substring(lastBracket + 1).trim();
      pgnText = headers + '\n\n' + moves;
    }

    console.log('[Analysis] Formatted PGN:', pgnText);
    $('#pgn-input').value = pgnText;
    chess.reset();
    setBoardFEN(chess.fen());
    window.__GAME_TOTAL__ = 0;
    navUpdate();
    console.log('[Analysis] Game loaded, PGN length:', pgnText.length);
  }

  function bindUI(){
    console.log('[Analysis] Binding UI...');
    const loadBtn = $('#btn-load-pgn');
    const analyzeBtn = $('#btn-analyze-game');
    const exportBtn = $('#btn-export-pgn');

    if(!loadBtn || !analyzeBtn || !exportBtn) {
      console.error('[Analysis] Buttons not found!', {loadBtn, analyzeBtn, exportBtn});
      return;
    }

    loadBtn.addEventListener('click', ()=>{
      console.log('[Analysis] Load PGN button clicked');
      const pick = prompt('Pick ID from Hall of Fame (e.g., opera-1858) or paste PGN here.');
      console.log('[Analysis] User entered:', pick);

      if(!pick) {
        console.log('[Analysis] User cancelled');
        return;
      }

      const found = GAMELIB.find(g=>g.id===pick);
      console.log('[Analysis] Found game:', found ? found.id : 'NOT FOUND');

      if(found) {
        loadPGNFromGame(found);
      } else if(pick) {
        console.log('[Analysis] No game found, treating as raw PGN');
        $('#pgn-input').value = pick;
      }
    });
    analyzeBtn.addEventListener('click', ()=>{
      console.log('[Analysis] Analyze button clicked');
      analyzeGame();
    });
    exportBtn.addEventListener('click', exportAnnotatedPGN);

    // Navigation buttons
    $('#first-move')?.addEventListener('click', ()=>{
      goToMove(0);
    });

    $('#prev-move')?.addEventListener('click', ()=>{
      if(currentMoveIndex > 0) {
        goToMove(currentMoveIndex - 1);
      }
    });

    $('#next-move')?.addEventListener('click', ()=>{
      if(currentMoveIndex < analyzedMoves.length) {
        goToMove(currentMoveIndex + 1);
      }
    });

    $('#last-move')?.addEventListener('click', ()=>{
      goToMove(analyzedMoves.length);
    });

    console.log('[Analysis] UI bound successfully');
  }

  function goToPly(ply){
    const tmp = new Chess();
    try { tmp.load_pgn(document.getElementById('pgn-input').value); } catch(e){ return; }
    const path = tmp.history({ verbose: true });
    chess.reset();
    const upto = Math.max(0, Math.min(ply, path.length));
    for(let i=0;i<upto;i++){ chess.move(path[i]); }
    setBoardFEN(chess.fen());
    window.__GAME_TOTAL__ = path.length;
    (function(){
      const hist = chess.history();
      const idx = hist.length; const total = window.__GAME_TOTAL__||0;
      document.getElementById('move-indicator').textContent = `${idx}/${total}`;
    })();
  }

  function init(engineCtrl){
    console.log('[Analysis] Initializing...');
    engine = engineCtrl;
    setupChart();
    bindUI();
    console.log('[Analysis] Initialized');
  }

  window.AnalysisMode = { init, loadPGNFromGame, goToPly };
})();

