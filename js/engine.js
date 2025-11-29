(function(){
  class EngineController {
    constructor(workerPath){
      this.workerPath = workerPath || 'workers/stockfish.worker.js';
      this.worker = null;
      this.listeners = { info: [], bestmove: [], raw: [] };
      this.ready = false;
    }
    start(){
      if(this.worker) return;
      this.worker = new Worker(this.workerPath);
      this.worker.onmessage = (e)=> this._handleMessage(e.data);
      this._post('uci');
      this._post('isready');
    }
    stop(){
      if(this.worker){ this.worker.terminate(); this.worker = null; this.ready = false; }
    }
    on(type, cb){ if(this.listeners[type]) this.listeners[type].push(cb); }
    off(type, cb){ this.listeners[type] = (this.listeners[type]||[]).filter(f=>f!==cb); }
    _emit(type, payload){ (this.listeners[type]||[]).forEach(f=>f(payload)); }
    _post(cmd){ if(this.worker) this.worker.postMessage(cmd); }
    setOption(name, value){ this._post(`setoption name ${name} value ${value}`); }
    positionFEN(fen){ this._post(`position fen ${fen}`); }
    goDepth(depth){ this._post(`go depth ${depth|0}`); }
    goInfinite(){ this._post('go infinite'); }
    stopSearch(){ this._post('stop'); }
    setMultiPV(n){ this.setOption('MultiPV', n|0); }

    _handleMessage(line){
      this._emit('raw', line);
      if(line === 'readyok'){ this.ready = true; return; }
      if(line.startsWith('info')){ this._emit('info', this._parseInfo(line)); return; }
      if(line.startsWith('bestmove')){ this._emit('bestmove', this._parseBest(line)); return; }
    }

    _parseBest(line){
      // bestmove e2e4 ponder e7e5
      const parts = line.split(/\s+/);
      return { bestmove: parts[1]||'' };
    }
    _parseInfo(line){
      // info depth 15 seldepth 25 multipv 1 score cp 34 pv e2e4 e7e5 ...
      const o = { raw: line };
      const m = line.match(/depth (\d+)/); if(m) o.depth = +m[1];
      const mv = line.match(/multipv (\d+)/); if(mv) o.multipv = +mv[1];
      const scMate = line.match(/score mate (-?\d+)/);
      const scCp = line.match(/score cp (-?\d+)/);
      if(scMate){ o.score = { type: 'mate', value: +scMate[1] }; }
      else if(scCp){ o.score = { type: 'cp', value: +scCp[1] }; }
      const pvIdx = line.indexOf(' pv ');
      if(pvIdx !== -1){ o.pv = line.slice(pvIdx+4).trim(); }
      const bm = line.match(/ currmove (\S+)/); if(bm) o.currmove = bm[1];
      return o;
    }

    requestEval(fen, depth=14, multipv=3){
      return new Promise((resolve)=>{
        const lines = [];
        const onInfo = (info)=>{ if(info.pv){ lines.push(info); } };
        const onBest = ()=>{ this.off('info', onInfo); this.off('bestmove', onBest); resolve(this._collect(lines, multipv)); };
        this.on('info', onInfo); this.on('bestmove', onBest);
        this.setMultiPV(multipv);
        this.positionFEN(fen);
        this.goDepth(depth);
      });
    }
    _collect(infos, multipv){
      // Keep only last info per multipv index
      const byIdx = new Map();
      for(const i of infos){ const k = i.multipv||1; byIdx.set(k, i); }
      return Array.from(byIdx.keys()).sort((a,b)=>a-b).slice(0, multipv).map(k=>byIdx.get(k));
    }
  }

  window.EngineController = EngineController;
})();

