(function(){
  function $(s){ return document.querySelector(s); }

  // Global board reference for analysis mode
  let board, engine;

  function initBoard(){
    const chess = new Chess();
    board = Chessboard('board', {
      position: 'start', draggable: false,
      pieceTheme: pieceThemeFromSetting(),
    });
    window.__BOARD__ = board;
  }

  function pieceThemeFromSetting(){
    const set = AppStorage.get().settings.pieceSet || 'wikipedia';
    // Use chessboardjs.com hosted images (official site)
    if(set==='merida') return 'https://chessboardjs.com/img/chesspieces/alpha/{piece}.png';
    return 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png';
  }

  function initEngine(){
    engine = new EngineController('workers/stockfish.worker.js');
    engine.start();
    engine.on('raw', (line)=>{/* dev: console.log(line); */});

    // Eval pointer baseline
    const ptr = document.getElementById('eval-pointer'); ptr.style.top = '50%';

    // Controls
    $('#engine-start').addEventListener('click', ()=> engine.start());
    $('#engine-stop').addEventListener('click', ()=> engine.stop());
  }

  function initSettings(){
    const st = AppStorage.get().settings;
    $('#setting-board-theme').value = st.theme||'brown';
    $('#setting-piece-set').value = st.pieceSet||'wikipedia';
    $('#setting-depth').value = st.depth||12;
    $('#setting-multipv').value = st.multipv||3;
    $('#engine-depth').value = st.depth||12;
    $('#engine-multipv').value = st.multipv||3;

    // New: puzzle timer/scoring controls
    const timerEnabledEl = $('#setting-timer-enabled');
    const timerSecondsEl = $('#setting-timer-seconds');
    const scoringEnabledEl = $('#setting-scoring-enabled');
    if(timerEnabledEl) timerEnabledEl.checked = !!st.timerEnabled;
    if(timerSecondsEl) timerSecondsEl.value = st.timerSeconds || 60;
    if(scoringEnabledEl) scoringEnabledEl.checked = st.scoringEnabled !== false;

    $('#save-settings').addEventListener('click', ()=>{
      AppStorage.update(s=>{
        s.settings.theme = $('#setting-board-theme').value;
        s.settings.pieceSet = $('#setting-piece-set').value;
        s.settings.depth = +$('#setting-depth').value;
        s.settings.multipv = +$('#setting-multipv').value;
        if(timerEnabledEl) s.settings.timerEnabled = !!timerEnabledEl.checked;
        if(timerSecondsEl) s.settings.timerSeconds = Math.max(10, Math.min(300, +timerSecondsEl.value||60));
        if(scoringEnabledEl) s.settings.scoringEnabled = !!scoringEnabledEl.checked;
      });
      alert('Settings saved.');
      location.reload();
    });

    $('#btn-settings').addEventListener('click', ()=>{
      const p = $('#settings-panel'); p.hidden = !p.hidden;
    });
  }

  function initNav(){
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn=> btn.addEventListener('click', ()=>{
      buttons.forEach(b=> b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.target;
      document.querySelectorAll('.mode-section').forEach(s=> s.hidden = (s.id !== target));
    }));
  }

  function wireInjection(){
    // Allow Hall of Fame to trigger a puzzle from a game position
    window.__injectPuzzle = (p)=>{
      // temporarily push into front and start
      const prev = window.PUZZLES.slice(0);
      window.PUZZLES.unshift(p);
      document.querySelector('[data-target="puzzle-section"]').click();
      setTimeout(()=> PuzzleMode.newPuzzle(), 50);
      // restore later
      setTimeout(()=>{ window.PUZZLES = prev; }, 1000);
    };
  }

  function initMobileUI(){
    // Menu toggle
    const shell = document.querySelector('.app-shell');
    const menuBtn = document.getElementById('btn-menu');
    if(menuBtn){ menuBtn.addEventListener('click', ()=> shell.classList.toggle('menu-collapsed')); }

    // Tabs (Lines/Chart)
    const rail = document.querySelector('.right-rail');
    const tabs = document.querySelectorAll('.mobile-tabs .tab-btn');
    tabs.forEach(btn=> btn.addEventListener('click', ()=>{
      tabs.forEach(b=> b.classList.remove('active'));
      btn.classList.add('active');
      if(btn.dataset.tab==='chart') rail.classList.add('show-chart'); else rail.classList.remove('show-chart');
    }));

    // Resize boards on viewport changes
    window.addEventListener('resize', ()=>{
      try{ window.__BOARD__ && window.__BOARD__.resize && window.__BOARD__.resize(); }catch{}
      try{ window.__PUZZLE_BOARD__ && window.__PUZZLE_BOARD__.resize && window.__PUZZLE_BOARD__.resize(); }catch{}
    });
  }

  function boot(){
    initBoard();
    initEngine();
    initNav();
    initSettings();
    initMobileUI();

    if(window.Importer && Importer.init) Importer.init();
    PuzzleMode.init(engine);
    AnalysisMode.init(engine);
    HallOfFame.init();
    wireInjection();
  }

  window.addEventListener('DOMContentLoaded', boot);
})();

