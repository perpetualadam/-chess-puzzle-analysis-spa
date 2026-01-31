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

  function applyBoardTheme(theme){
    const wrapper = document.getElementById('board-wrapper');
    if(!wrapper) return;
    const themes = ['brown','green','blue','gray','white','black'];
    themes.forEach(t=> wrapper.classList.remove('theme-'+t));
    wrapper.classList.add('theme-'+(theme||'brown'));
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
    const ptr = document.getElementById('eval-pointer'); if(ptr) ptr.style.top = '50%';

    // Engine Start/Stop with UI feedback
    const btnStart = document.getElementById('engine-start');
    const btnStop = document.getElementById('engine-stop');
    function updateEngineButtons(){ if(btnStop) btnStop.disabled = !engine.worker; if(btnStart) btnStart.disabled = !!engine.worker; }
    if(btnStart){ btnStart.addEventListener('click', ()=>{ engine.start(); updateEngineButtons(); }); }
    if(btnStop){ btnStop.addEventListener('click', ()=>{ engine.stop(); updateEngineButtons(); }); }
    updateEngineButtons();
  }

  function initSettings(){
    const st = AppStorage.get().settings;
    const theme = st.theme||'brown';
    $('#setting-board-theme').value = theme;
    applyBoardTheme(theme);
    const themeSelect = $('#setting-board-theme');
    if(themeSelect) themeSelect.addEventListener('change', ()=>{ applyBoardTheme($('#setting-board-theme').value); });
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

    const settingsPanel = document.getElementById('settings-panel');
    const settingsBackdrop = document.getElementById('settings-backdrop');
    const appShell = document.querySelector('.app-shell');
    function openSettings(){
      if(appShell) appShell.classList.remove('menu-collapsed');
      if(settingsPanel){ settingsPanel.hidden = false; settingsPanel.setAttribute('aria-hidden', 'false'); }
      if(settingsBackdrop){ settingsBackdrop.hidden = false; settingsBackdrop.setAttribute('aria-hidden', 'false'); }
    }
    function closeSettings(){
      if(settingsPanel){ settingsPanel.hidden = true; settingsPanel.setAttribute('aria-hidden', 'true'); }
      if(settingsBackdrop){ settingsBackdrop.hidden = true; settingsBackdrop.setAttribute('aria-hidden', 'true'); }
    }
    function toggleSettings(){
      if(settingsPanel && settingsPanel.hidden) openSettings();
      else closeSettings();
    }
    document.body.addEventListener('click', function settingsClick(e){
      const btn = (e.target.closest && e.target.closest('#btn-settings')) || (e.target.id === 'btn-settings' ? e.target : null);
      if(btn){ e.preventDefault(); e.stopPropagation(); toggleSettings(); return; }
      if(e.target === settingsBackdrop){ e.preventDefault(); closeSettings(); }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && settingsPanel && !settingsPanel.hidden){ closeSettings(); }
    });
    const btnHelp = document.getElementById('btn-help');
    const helpOverlay = document.getElementById('help-overlay');
    const helpClose = document.getElementById('help-close');
    if(btnHelp && helpOverlay){
      btnHelp.addEventListener('click', ()=>{ helpOverlay.hidden = false; });
    }
    if(helpClose && helpOverlay){
      helpClose.addEventListener('click', ()=>{ helpOverlay.hidden = true; });
    }
    if(helpOverlay){
      helpOverlay.addEventListener('click', (e)=>{ if(e.target === helpOverlay) helpOverlay.hidden = true; });
      document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && !helpOverlay.hidden){ helpOverlay.hidden = true; } });
    }
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

