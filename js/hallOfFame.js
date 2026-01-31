(function(){
  function $(s){ return document.querySelector(s); }

  function renderList(){
    const list = $('#hof-list');
    list.innerHTML = '';
    for(const g of GAMELIB){
      const div = document.createElement('div');
      div.className = 'hof-item';
      const meta = document.createElement('div'); meta.textContent = `${g.name}`;
      const src = document.createElement('div'); src.style.color = '#a7a7a7'; src.textContent = g.source || '';
      const actions = document.createElement('div'); actions.className = 'hof-actions';
      const replay = document.createElement('button'); replay.type = 'button'; replay.textContent = 'Replay'; replay.addEventListener('click', ()=> AnalysisMode.loadPGNFromGame(g));
      const puzzle = document.createElement('button'); puzzle.type = 'button'; puzzle.textContent = 'Start Key Puzzle'; puzzle.addEventListener('click', ()=>{
        // Create a puzzle from midgame
        const tmp = new Chess(); try{ tmp.load_pgn(g.pgn); }catch{};
        const ply = Math.max(4, Math.min( tmp.history().length-2, Math.floor(tmp.history().length/2) ));
        const p = { id: `hof-${g.id}-${ply}`, from: { gameId: g.id, ply }, side: (ply%2? 'w':'b'), rating: 1200, themes: ['tactic'], source: g.name };
        window.__injectPuzzle && window.__injectPuzzle(p);
      });
      actions.append(replay, puzzle);
      div.append(meta, src, actions);
      list.append(div);
    }
  }

  function init(){ renderList(); }

  window.HallOfFame = { init };
})();

