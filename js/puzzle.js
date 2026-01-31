(function(){
  const state = AppStorage.get();
  const chess = new Chess();
  let board, engine, arrowsCanvas, ctx;
  let currentPuzzle = null; // {id, fen, from, side, rating, themes, source, best}
  let mode = 'rated';
  let pendingCheck = false;
  // Timer
  let timerId = null, remaining = 0;
  // One-shot dev verifier guard
  let __matesVerified = false;
  // Rush mode state
  let rushState = { active: false, timeRemaining: 180, strikes: 0, score: 0, solved: 0, rushTimer: null };
  // Battle mode state
  let battleState = { active: false, playerScore: 0, aiScore: 0, targetScore: 5, aiTimer: null };
  // Multi-move puzzle state
  let puzzleMoveIndex = 0; // Track which move in the solution sequence
  let playerColor = 'w'; // Which color the player is playing
  let selectedSquare = null; // For tap-to-show-moves on mobile

  function $(sel){ return document.querySelector(sel); }

  function setPuzzleMessage(text, type){
    const el = $('#puzzle-instructions');
    if(el) el.textContent = text;
  }

  function formatMove(move){ return move ? (move.san || move.from + move.to) : ''; }

  function buildStatus(opts){
    const parts = [];
    if(opts.puzzleName) parts.push(opts.puzzleName);
    if(opts.tactic && opts.tactic.length) parts.push('Tactic: ' + opts.tactic.join(', '));
    if(opts.check) parts.push('King in check!');
    if(opts.move) parts.push('Move: ' + opts.move);
    if(opts.instruction) parts.push(opts.instruction);
    return parts.filter(Boolean).join(' · ');
  }

  function initBoard(){
    const onDrop = (source, target, piece, newPos, oldPos, orientation) => {
      if(pendingCheck) return 'snapback';
      if(!currentPuzzle) return 'snapback'; // No puzzle loaded
      clearMoveDots();
      const move = chess.move({ from: source, to: target, promotion: 'q' });
      if(!move) return 'snapback';
      board.position(chess.fen(), false);
      verifyMove(move);
    };
    board = Chessboard('board', {
      position: chess.fen(),
      draggable: true,
      orientation: 'white',
      pieceTheme: pieceThemeFromSetting(),
      onDrop,
    });
    window.__PUZZLE_BOARD__ = board;

    arrowsCanvas = $('#arrows-canvas');
    const resize = () => { try{ board && board.resize && board.resize(); }catch{} const r = $('#board').getBoundingClientRect(); arrowsCanvas.width = r.width; arrowsCanvas.height = r.height; arrowsCanvas.style.width = r.width+'px'; arrowsCanvas.style.height = r.height+'px'; drawArrows([]); };
    ctx = arrowsCanvas.getContext('2d');
    window.addEventListener('resize', resize);
    setTimeout(resize, 50);

    const wrapper = document.getElementById('board-wrapper');
    if(wrapper){
      wrapper.addEventListener('click', (e)=>{
        if(!currentPuzzle || pendingCheck) return;
        const sq = squareFromPoint(e.clientX, e.clientY);
        if(sq){ showMovesForSquare(sq); }
        else { clearMoveDots(); drawArrows([]); }
      });
      wrapper.addEventListener('touchstart', (e)=>{ if(e.touches.length===1) window.__touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
      wrapper.addEventListener('touchend', (e)=>{
        if(!currentPuzzle || pendingCheck || !e.changedTouches.length) return;
        const t = e.changedTouches[0];
        const start = window.__touchStart;
        if(start && Math.abs(t.clientX - start.x) < 15 && Math.abs(t.clientY - start.y) < 15){
          const sq = squareFromPoint(t.clientX, t.clientY);
          if(sq){ showMovesForSquare(sq); e.preventDefault(); }
          else { clearMoveDots(); drawArrows([]); }
        }
      }, { passive: false });
    }
  }

  function pieceThemeFromSetting(){
    const set = AppStorage.get().settings.pieceSet || 'wikipedia';
    // Use chessboardjs.com hosted images (official site)
    if(set==='merida') return 'https://chessboardjs.com/img/chesspieces/alpha/{piece}.png';
    return 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png';
  }

  function uciToSquares(uci){ return [uci.slice(0,2), uci.slice(2,4)]; }
  function algebraicToUciSan(chess, san){
    try { const mv = chess.move(san, { sloppy: true }); if(!mv) return null; chess.undo(); return mv.from+mv.to+(mv.promotion||''); } catch{ return null; }
  }

  function sqToXY(size, sq){ const f = sq.charCodeAt(0)-97; const rnk = 8 - (sq.charCodeAt(1)-48); return { x: f*size + size/2, y: rnk*size + size/2 }; }

  function drawArrows(arr){
    if(!ctx || !arrowsCanvas) return;
    const r = $('#board').getBoundingClientRect();
    if(!r.width) return;
    ctx.clearRect(0,0,arrowsCanvas.width, arrowsCanvas.height);
    const size = r.width/8;
    ctx.lineWidth = Math.max(4, size*0.08);
    for(const a of arr){
      const [from, to] = uciToSquares(a.move);
      const p1 = sqToXY(size, from), p2 = sqToXY(size, to);
      ctx.strokeStyle = a.color||'rgba(63,185,80,0.9)';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      const angle = Math.atan2(p2.y-p1.y, p2.x-p1.x);
      const head = size*0.35;
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p2.x - head*Math.cos(angle-0.5), p2.y - head*Math.sin(angle-0.5));
      ctx.lineTo(p2.x - head*Math.cos(angle+0.5), p2.y - head*Math.sin(angle+0.5));
      ctx.closePath(); ctx.fill();
    }
    if(selectedSquare && window.__lastMoveDots){ drawMoveDots(size, window.__lastMoveDots); }
  }

  function clearMoveDots(){ selectedSquare = null; window.__lastMoveDots = null; }

  function squareFromPoint(px, py){
    const r = $('#board').getBoundingClientRect();
    if(px < r.left || px > r.right || py < r.top || py > r.bottom) return null;
    const size = r.width / 8;
    const x = px - r.left, y = py - r.top;
    const col = Math.floor(x / size), row = Math.floor(y / size);
    if(col < 0 || col > 7 || row < 0 || row > 7) return null;
    const ori = (board && board.orientation) ? board.orientation() : 'white';
    const file = ori === 'black' ? 7 - col : col;
    const rank = ori === 'black' ? row + 1 : 8 - row;
    return String.fromCharCode(97 + file) + rank;
  }

  function showMovesForSquare(sq){
    if(!chess.get(sq) || chess.get(sq).color !== chess.turn()) return;
    const moves = chess.moves({ square: sq, verbose: true });
    const toSquares = moves.map(m => m.to);
    selectedSquare = sq;
    window.__lastMoveDots = toSquares;
    drawArrows([]);
  }

  function drawMoveDots(size, squares){
    if(!squares || !squares.length) return;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
    ctx.lineWidth = 2;
    const radius = size * 0.2;
    for(const sq of squares){
      const { x, y } = sqToXY(size, sq);
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
  }

  // Timer helpers
  function stopTimer(){ if(timerId){ clearInterval(timerId); timerId=null; } }
  function updateTimerUI(){ const el = document.getElementById('puzzle-timer'); if(!el) return; if(remaining>0){ el.textContent = '⏱ ' + remaining; } }
  function timeUp(){ pendingCheck = true; const info = $('#puzzle-instructions'); info.textContent = 'Out of time. This puzzle counts as failed.'; onSolve(false, -100); pendingCheck = false; }
  function startTimer(){ stopTimer(); const st = AppStorage.get().settings; const el = document.getElementById('puzzle-timer'); if(!st.timerEnabled || !el){ if(el) el.hidden = true; return; } remaining = Math.max(10, +st.timerSeconds||60); el.hidden = false; updateTimerUI(); timerId = setInterval(()=>{ remaining -= 1; if(remaining<=0){ stopTimer(); updateTimerUI(); timeUp(); } else { updateTimerUI(); } }, 1000); }


  async function verifyMove(move){
    pendingCheck = true;
    if(!engine || !engine.worker){ setPuzzleMessage('Engine stopped. Start Engine to verify moves.'); pendingCheck = false; return; }
    const depth = +($('#engine-depth').value || AppStorage.get().settings.depth || 12);
    const multipv = +($('#engine-multipv').value || AppStorage.get().settings.multipv || 3);

    let lines = [];
    try {
      const before = new Chess(chess.fen()); before.undo(); const startFEN = before.fen();
      lines = await engine.requestEval(startFEN, Math.max(8, depth-2), multipv);
    } catch(e){ setPuzzleMessage('Engine not ready. Click Start Engine.'); pendingCheck = false; return; }
    const bestUCIs = lines.map(l => (l.pv||'').split(/\s+/)[0]).filter(Boolean);

    const played = move.from+move.to+(move.promotion||'');
    const isTop = bestUCIs.includes(played);

    // Evaluate after move to gauge quality
    const afterFEN = chess.fen();
    let afterLines = [];
    try { afterLines = await engine.requestEval(afterFEN, depth, 1); } catch(e){}
    const beforeTop = lines[0]?.score; const afterTop = afterLines[0]?.score;

    let ok = isTop;
    let delta = 0;
    if(beforeTop && afterTop){
      const toCp = (s)=> s.type==='mate' ? (s.value>0? 100000 : -100000) : s.value;
      delta = toCp(afterTop) - toCp(beforeTop);
      if(!ok) ok = delta > -30; // allow near-equal good moves
    }

    const info = $('#puzzle-instructions');
    const moveSan = move.san || (move.from + move.to);
    if(ok){
      const msg = chess.in_check() ? 'Correct! ' + moveSan + ' · King in check!' : 'Correct! ' + moveSan;
      setPuzzleMessage(msg);
      drawArrows([{ move: played }]);
      puzzleMoveIndex++;

      // Check if puzzle is complete
      if(isPuzzleComplete()){
        onSolve(true, delta);
      } else {
        // Play opponent's response after a delay (keep pendingCheck so user cannot move until opponent has played)
        setTimeout(() => playOpponentMove(), 400);
        return;
      }
    } else {
      setPuzzleMessage('Not the best move. Try again or view solution.');
      onSolve(false, delta);
    }
    pendingCheck = false;
  }

  function isPuzzleComplete(){
    if(chess.game_over()) return true;
    return false;
  }

  async function playOpponentMove(){
    if(!currentPuzzle || chess.game_over()){ pendingCheck = false; return; }
    if(!engine || !engine.worker){ setPuzzleMessage('Engine stopped. Start Engine for opponent moves.'); pendingCheck = false; return; }
    pendingCheck = true;
    let lines = [];
    try {
      const depth = +($('#engine-depth').value || AppStorage.get().settings.depth || 12);
      lines = await engine.requestEval(chess.fen(), depth, 1);
    } catch(e){ setPuzzleMessage('Engine not ready. Start Engine.'); pendingCheck = false; return; }
    const bestMove = lines[0]?.pv?.split(/\s+/)[0];

    if(bestMove && bestMove.length >= 4){
      const from = bestMove.slice(0, 2);
      const to = bestMove.slice(2, 4);
      const promotion = bestMove[4] || '';

      const move = chess.move({ from, to, promotion: promotion || undefined });
      if(move){
        board.position(chess.fen(), true); // Animate opponent's move
        drawArrows([{ move: bestMove, color: 'rgba(255,100,100,0.7)' }]);
        puzzleMoveIndex++;

        // Check if game is over after opponent's move
        if(chess.game_over()){
          setPuzzleMessage((currentPuzzle.source || 'Puzzle') + ' complete!');
          onSolve(true, 0);
        } else {
          const instr = chess.in_check() ? 'Your turn · King in check!' : 'Your turn — find the next move.';
          setPuzzleMessage(instr);
        }
      }
    }

    pendingCheck = false;
  }

  function onSolve(correct, delta){
    // Battle mode handling
    if(battleState.active){
      if(battleState.aiTimer){ clearTimeout(battleState.aiTimer); battleState.aiTimer = null; }
      if(correct){
        battleState.playerScore += 1;
        updateBattleUI();
        $('#puzzle-instructions').textContent = 'You solved it first!';
        if(battleState.playerScore >= battleState.targetScore){ endBattle(); return; }
        setTimeout(()=> newPuzzle(), 1500);
      }
      return;
    }

    // Rush mode handling
    if(rushState.active){
      if(correct){
        rushState.score += 10 + Math.max(0, Math.round(delta/10));
        rushState.solved += 1;
        updateRushUI();
        setTimeout(()=> newPuzzle(), 800); // Auto-advance
      } else {
        rushState.strikes += 1;
        updateRushUI();
        if(rushState.strikes >= 3){
          endRush();
          return;
        }
      }
      return;
    }

    const ps = state.puzzle;
    const st = AppStorage.get().settings || {};
    if(st.timerEnabled){ stopTimer(); }

    if(st.scoringEnabled === false){
      // Scoring disabled: do not change rating/streak/level
      AppStorage.update(s=>{ s.puzzle.history.push({ id: currentPuzzle.id, ok: !!correct, t: Date.now(), ns: true }); });
      refreshStats();
      return;
    }

    // Safety check: ensure currentPuzzle exists
    if (!currentPuzzle) {
      console.warn('[Puzzle] onSolve called but currentPuzzle is null');
      return;
    }

    let rating = ps.rating|0, streak = ps.streak|0, level = ps.level|0;
    if(correct){ streak += 1; rating += Math.max(3, Math.min(24, 10 + Math.round(delta/20))); }
    else { streak = 0; rating = Math.max(300, rating - 12); }
    if(streak && streak % 5 === 0) level += 1;
    AppStorage.update(s=>{ s.puzzle.rating = rating; s.puzzle.streak = streak; s.puzzle.level = level; s.puzzle.history.push({ id: currentPuzzle.id, ok: !!correct, t: Date.now() }); });
    refreshStats();
  }

  function refreshStats(){
    $('#user-rating').textContent = state.puzzle.rating;
    $('#user-streak').textContent = state.puzzle.streak;
    $('#user-level').textContent = state.puzzle.level;
  }

  function startRush(){
    rushState = { active: true, timeRemaining: 180, strikes: 0, score: 0, solved: 0, rushTimer: null };
    updateRushUI();
    $('#rush-stats').hidden = false;
    $('#btn-start-rush').hidden = true;
    $('#btn-end-rush').hidden = false;
    $('#btn-hint').disabled = true;
    $('#btn-solution').disabled = true;
    rushState.rushTimer = setInterval(()=>{
      rushState.timeRemaining -= 1;
      updateRushUI();
      if(rushState.timeRemaining <= 0){ endRush(); }
    }, 1000);
    newPuzzle();
  }

  function endRush(){
    if(rushState.rushTimer){ clearInterval(rushState.rushTimer); rushState.rushTimer = null; }
    const finalScore = rushState.score, finalSolved = rushState.solved;
    rushState.active = false;
    $('#rush-stats').hidden = true;
    $('#btn-start-rush').hidden = false;
    $('#btn-end-rush').hidden = true;
    $('#btn-hint').disabled = false;
    $('#btn-solution').disabled = false;
    alert(`Rush Over!\n\nScore: ${finalScore}\nPuzzles Solved: ${finalSolved}\n\nGreat job!`);
  }

  function startBattle(){
    battleState = { active: true, playerScore: 0, aiScore: 0, targetScore: 5, aiTimer: null };
    updateBattleUI();
    $('#battle-stats').hidden = false;
    $('#btn-start-battle').hidden = true;
    $('#btn-end-battle').hidden = false;
    $('#btn-hint').disabled = true;
    $('#btn-solution').disabled = true;
    newPuzzle();
  }

  function endBattle(){
    if(battleState.aiTimer){ clearTimeout(battleState.aiTimer); battleState.aiTimer = null; }
    const pScore = battleState.playerScore, aScore = battleState.aiScore;
    battleState.active = false;
    $('#battle-stats').hidden = true;
    $('#btn-start-battle').hidden = false;
    $('#btn-end-battle').hidden = true;
    $('#btn-hint').disabled = false;
    $('#btn-solution').disabled = false;
    const winner = pScore >= battleState.targetScore ? 'You win!' : (aScore >= battleState.targetScore ? 'AI wins!' : 'Match ended');
    alert(`Battle Over!\n\n${winner}\n\nYour Score: ${pScore}\nAI Score: ${aScore}`);
  }

  function updateBattleUI(){
    $('#battle-player-score').textContent = battleState.playerScore;
    $('#battle-ai-score').textContent = battleState.aiScore;
    $('#battle-target-score').textContent = battleState.targetScore;
  }

  function simulateAISolve(){
    if(!battleState.active || !currentPuzzle) return;
    const rating = currentPuzzle.rating || 1200;
    const aiAccuracy = Math.max(0.5, Math.min(0.95, 1.0 - (rating - 600) / 2000));
    const solveTime = 2000 + Math.random() * 4000;
    battleState.aiTimer = setTimeout(()=>{
      if(!battleState.active) return;
      const aiSolved = Math.random() < aiAccuracy;
      if(aiSolved){
        battleState.aiScore += 1;
        updateBattleUI();
        $('#puzzle-instructions').textContent = 'AI solved it first!';
        if(battleState.aiScore >= battleState.targetScore){ endBattle(); return; }
        setTimeout(()=> newPuzzle(), 1500);
      }
    }, solveTime);
  }

  function updateRushUI(){
    const mins = Math.floor(rushState.timeRemaining / 60);
    const secs = rushState.timeRemaining % 60;
    $('#rush-time-remaining').textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
    const strikeIcons = ['⭕','⭕','⭕'];
    for(let i=0; i<rushState.strikes && i<3; i++){ strikeIcons[i] = '❌'; }
    $('#rush-strikes-display').textContent = strikeIcons.join('');
    $('#rush-score').textContent = rushState.score;
    $('#rush-solved').textContent = rushState.solved;
  }

  function resolvePuzzlePosition(p){
    if(p.fen) return p.fen;
    if(p.from && p.from.gameId){
      const game = GAMELIB.find(g=>g.id===p.from.gameId);
      if(!game) return null;
      const tmp = new Chess();
      try{ tmp.load_pgn(game.pgn); }catch{ return null; }
      const hist = tmp.history({ verbose: true });
      const mv = hist[p.from.ply-1];
      if(!mv){ return tmp.fen(); }
      // Create fen at the side-to-move the puzzle expects
      const pre = new Chess(); pre.load_pgn(game.pgn);
      for(let i=0;i<p.from.ply-1;i++){ const m = hist[i]; pre.move(m); }
      return pre.fen();
    }
    return null;
  }

  function orientForSide(side){ board.orientation(side==='w'?'white':'black'); }

  async function newPuzzle(){
    const m = mode;
    stopTimer(); // reset any running timer

    const imported = (window.Importer && Importer.getImported) ? Importer.getImported() : [];
    let pool = PUZZLES.slice();
    const includeImported = (m==='custom') ? (document.getElementById('filter-include-imported')?.checked) : true;
    if(includeImported) pool = pool.concat(imported);

    if(m==='custom'){
      const theme = $('#filter-theme').value;
      const rmin = +$('#filter-min').value, rmax = +$('#filter-max').value;
      pool = pool.filter(p=> (theme==='any'||(p.themes||[]).includes(theme)) && (p.rating||1000)>=rmin && (p.rating||1000)<=rmax);
    } else if(m==='daily'){
      const day = Math.floor(Date.now()/(24*3600*1000));
      pool = [ PUZZLES[ day % PUZZLES.length ] ];
    }
    // Rated: weight by proximity to user rating
    if(m==='rated'){
      const ur = state.puzzle.rating;
      pool.sort((a,b)=> Math.abs((a.rating||1200)-ur) - Math.abs((b.rating||1200)-ur));
    }
    currentPuzzle = pool[ Math.floor(Math.random()*Math.min(8, pool.length)) ] || PUZZLES[0];
    const fen = resolvePuzzlePosition(currentPuzzle);
    if(!fen){ alert('Failed to resolve puzzle position.'); return; }
    chess.load(fen);

    // Randomize player color (50/50 chance)
    const randomizeColor = Math.random() < 0.5;
    if(randomizeColor){
      // Flip the side to move
      playerColor = chess.turn() === 'w' ? 'b' : 'w';
    } else {
      playerColor = chess.turn(); // Player plays the side to move
    }

    // If player is not the side to move, play opponent's first move
    if(playerColor !== chess.turn() && engine && engine.worker){
      setTimeout(async () => {
        try {
          const depth = +($('#engine-depth').value || AppStorage.get().settings.depth || 12);
          const lines = await engine.requestEval(chess.fen(), depth, 1);
          const bestMove = lines[0]?.pv?.split(/\s+/)[0];
          if(bestMove && bestMove.length >= 4){
            const from = bestMove.slice(0, 2);
            const to = bestMove.slice(2, 4);
            const promotion = bestMove[4] || '';
            const move = chess.move({ from, to, promotion: promotion || undefined });
            if(move){
              board.position(chess.fen(), true);
              drawArrows([{ move: bestMove, color: 'rgba(255,100,100,0.7)' }]);
              setPuzzleMessage((currentPuzzle.source || 'Puzzle') + ' · Your turn — find the best move.');
            }
          }
        } catch(e){ setPuzzleMessage('Your turn. (Engine was stopped; start it for hints.)'); }
      }, 500);
    }

    board.position(fen, false);
    orientForSide(playerColor);
    puzzleMoveIndex = 0; // Reset move counter

    $('#puzzle-source').textContent = `${currentPuzzle.source||''} · Themes: ${(currentPuzzle.themes||[]).join(', ')} · Playing as ${playerColor === 'w' ? 'White' : 'Black'}`;
    const tipEl = document.getElementById('puzzle-pattern-tip');
    if(tipEl){ const tip = currentPuzzle.patternTip; tipEl.hidden = !tip; tipEl.textContent = tip ? `Tip: ${tip}` : ''; }
    const tactic = (currentPuzzle.themes||[]).join(', ') || 'best move';
    const name = currentPuzzle.source || ('Puzzle ' + (currentPuzzle.id||''));
    const startMsg = chess.in_check() ? name + ' · King in check! Find the best move.' : name + ' · Tactic: ' + tactic + '. Find the best move.';
    setPuzzleMessage(startMsg);
    startTimer();

    // Toggle View Source Game button for game-derived puzzles
    const viewBtn = document.getElementById('btn-view-source');
    if(viewBtn){ viewBtn.hidden = !(currentPuzzle && currentPuzzle.from && currentPuzzle.from.gameId); }

    clearMoveDots();
    drawArrows([]);
    if(engine) showEngineLines();

    // Start AI simulation in Battle mode
    if(battleState.active){ simulateAISolve(); }
  }

  function viewSourceGame(){
    if(!currentPuzzle || !currentPuzzle.from || !currentPuzzle.from.gameId) return;
    const { gameId, ply } = currentPuzzle.from;
    const game = (window.GAMELIB||[]).find(g=> g.id === gameId);
    if(!game){ alert('Source game not found.'); return; }
    // Switch to Analysis Mode
    const navBtn = document.querySelector('[data-target="analysis-section"]');
    if(navBtn) navBtn.click();
    // Load PGN and jump to ply
    setTimeout(()=>{
      try{
        AnalysisMode.loadPGNFromGame(game);
        AnalysisMode.goToPly((ply|0));
      }catch(e){ console.warn('Failed to jump to analysis position', e); }
    }, 50);
  }

  function showSolution(){
    if(!currentPuzzle) return;
    const tmp = new Chess(chess.fen());
    const best = currentPuzzle.best && Array.isArray(currentPuzzle.best) ? currentPuzzle.best : [];
    const arrows = [];
    for(let i = 0; i < best.length; i++){
      const sanOrUci = best[i];
      let moveUci = null;
      if(/^[a-h][1-8][a-h][1-8]/.test(sanOrUci)) moveUci = sanOrUci;
      else moveUci = algebraicToUciSan(tmp, sanOrUci);
      if(!moveUci) break;
      const move = tmp.move({ from: moveUci.slice(0,2), to: moveUci.slice(2,4), promotion: (moveUci.length >= 5) ? moveUci[4] : 'q' });
      if(!move) break;
      arrows.push({ move: moveUci, color: 'rgba(59,130,246,0.9)' });
    }
    if(arrows.length === 0){
      $('#puzzle-instructions').textContent = 'No explicit solution stored. Use engine to inspect.';
      return;
    }
    board.position(tmp.fen(), true);
    drawArrows(arrows);
    $('#puzzle-instructions').textContent = 'Solution: ' + best.slice(0, arrows.length).join(', ');
  }

  function showEngineLines(){
    if(!engine || !engine.worker){ setPuzzleMessage('Engine stopped. Click Start Engine in the right panel.'); return; }
    const depth = +($('#engine-depth').value || AppStorage.get().settings.depth || 12);
    const multipv = +($('#engine-multipv').value || AppStorage.get().settings.multipv || 3);
    engine.requestEval(chess.fen(), depth, multipv).then(lines => {
      const linesDiv = document.getElementById('engine-lines');
      const fmt = (l)=>{
        const s = l.score ? (l.score.type==='cp' ? (l.score.value/100).toFixed(2) : `#${l.score.value}`) : '';
        const first = (l.pv||'').split(/\s+/)[0]||'';
        return `${l.multipv||1}. ${s} ${first}`;
      };
      linesDiv.textContent = lines.map(fmt).join('\n');
      drawArrows(lines.filter(l=>l.pv).map(l=>({ move: l.pv.split(/\s+/)[0], color: 'rgba(63,185,80,0.7)' })));
    }).catch(()=>{ setPuzzleMessage('Engine not ready. Click Start Engine.'); });
  }

  // Quick app-side verification for composed mate-pattern puzzles (path check only)
  function verifyMatePatternsOnce(){
    if(__matesVerified) return; __matesVerified = true;
    return runPuzzleVerification();
  }

  function runPuzzleVerification(){
    try{
      const targets = (window.PUZZLES||[]).filter(p=> (p.source||'').startsWith('Composed:') && (p.themes||[]).includes('mate'));
      const results = [];
      for(const p of targets){
        const tmp = new Chess();
        const fen = p.fen || (p.from ? null : null);
        if(!fen){ results.push({ id:p.id, ok:false, err:'no-fen' }); continue; }
        try{ tmp.load(fen); }catch(e){ results.push({ id:p.id, ok:false, err:'bad-fen' }); continue; }
        const side = (p.side||'w');
        if((side==='w' && tmp.turn()!=='w')||(side==='b' && tmp.turn()!=='b')){ results.push({ id:p.id, ok:false, err:'turn-mismatch' }); continue; }
        let ok=true, err='';
        if(Array.isArray(p.best) && p.best.length){
          for(const san of p.best){
            const mv = tmp.move(san, { sloppy:true });
            if(!mv){ ok=false; err = 'illegal:'+san; break; }
          }
          if(ok){ ok = tmp.in_checkmate(); if(!ok) err='not-mate'; }
        } else {
          ok=false; err='no-solution';
        }
        results.push({ id:p.id, ok, err: ok?'':err });
      }
      const okCount = results.filter(r=>r.ok).length;
      const fail = results.filter(r=>!r.ok);
      console.log('[MateVerifier] Composed mate puzzles verified:', okCount, '/', results.length, { failures: fail });
      if(fail.length > 0){
        console.error('[MateVerifier] FAILING PUZZLES:', fail.map(f => `${f.id} (${f.err})`).join(', '));
      }
      const info = document.getElementById('puzzle-instructions');
      if(info){ info.dataset.verifyNote = `${okCount}/${results.length} mate patterns verified`; }
      window.__MATE_VERIFY__ = results;
      return { total: results.length, passed: okCount, failed: fail.length, failures: fail };
    }catch(e){ console.warn('Mate verification failed', e); return null; }
  }

  function showVerificationToast(){
    const result = runPuzzleVerification();
    if(!result){ alert('Verification failed. Check console for details.'); return; }
    const msg = `Puzzle Verification Complete\n\nTotal: ${result.total}\nPassed: ${result.passed}\nFailed: ${result.failed}${result.failed > 0 ? '\n\nFailed IDs: ' + result.failures.map(f=>f.id).join(', ') : ''}`;
    alert(msg);
  }

  function updateScoringUI(){
    const st = AppStorage.get().settings||{};
    const stats = document.querySelector('.puzzle-stats');
    if(stats){ stats.classList.toggle('scoring-off', st.scoringEnabled===false); }
    const timerEl = document.getElementById('puzzle-timer');
    if(timerEl){ timerEl.hidden = st.timerEnabled!==true; }
  }

  function bindUI(){
    $('#puzzle-mode').addEventListener('change', (e)=>{
      mode = e.target.value;
      document.getElementById('custom-filters').hidden = (mode!=='custom');
      const isRush = (mode==='rush');
      const isBattle = (mode==='battle');
      $('#btn-start-rush').hidden = !isRush;
      $('#btn-start-battle').hidden = !isBattle;
      $('#btn-new-puzzle').hidden = (isRush || isBattle);
      if(rushState.active && !isRush){ endRush(); }
      if(battleState.active && !isBattle){ endBattle(); }
    });
    $('#btn-new-puzzle').addEventListener('click', newPuzzle);
    $('#btn-hint').addEventListener('click', ()=>{ showEngineLines(); });
    $('#btn-solution').addEventListener('click', showSolution);
    $('#btn-start-rush').addEventListener('click', startRush);
    $('#btn-end-rush').addEventListener('click', endRush);
    $('#btn-start-battle').addEventListener('click', startBattle);
    $('#btn-end-battle').addEventListener('click', endBattle);

    const viewBtn = document.getElementById('btn-view-source');
    if(viewBtn){ viewBtn.addEventListener('click', viewSourceGame); }

    // Inline toggles
    const st = AppStorage.get().settings;
    const tcb = document.getElementById('toggle-timer');
    const scb = document.getElementById('toggle-scoring');
    if(tcb){ tcb.checked = !!st.timerEnabled; tcb.addEventListener('change', (e)=>{
      AppStorage.update(s=>{ s.settings.timerEnabled = !!e.target.checked; });
      if(e.target.checked) startTimer(); else { stopTimer(); const el = document.getElementById('puzzle-timer'); if(el) el.hidden = true; }
    }); }
    if(scb){ scb.checked = (st.scoringEnabled!==false); scb.addEventListener('change', (e)=>{
      AppStorage.update(s=>{ s.settings.scoringEnabled = !!e.target.checked; });
      updateScoringUI();
    }); }

    // Developer verification button
    const verifyBtn = document.getElementById('btn-verify-puzzles');
    if(verifyBtn){ verifyBtn.addEventListener('click', showVerificationToast); }

    updateScoringUI();
  }

  function init(engineCtrl){
    engine = engineCtrl;
    initBoard();
    bindUI();
    refreshStats();
    // Run a quick one-time verification of composed mate-pattern puzzles
    setTimeout(verifyMatePatternsOnce, 100);
  }

  window.PuzzleMode = { init, newPuzzle };
})();

