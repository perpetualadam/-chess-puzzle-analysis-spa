(function(){
  const KEY = 'chess_spa_state_v1';
  const isMobile = /Mobi|Android/i.test(navigator.userAgent) || (window.innerWidth < 700);
  const defaultState = {
    settings: {
      theme: 'brown', pieceSet: 'wikipedia',
      depth: isMobile ? 10 : 14, multipv: isMobile ? 2 : 3,
      timerEnabled: false, timerSeconds: 60,
      scoringEnabled: true,
    },
    puzzle: { rating: 1200, streak: 0, level: 1, history: [] },
  };

  function load(){
    try { return JSON.parse(localStorage.getItem(KEY)) || defaultState; } catch(e){ return defaultState; }
  }
  function save(state){ localStorage.setItem(KEY, JSON.stringify(state)); }

  const state = load();

  window.AppStorage = {
    get(){ return state; },
    update(fn){ fn(state); save(state); },
    reset(){ save(defaultState); location.reload(); },
  };
})();

