(function(){
  const IMPORT_KEY = 'imported_puzzles_v1';

  function saveImported(puzzles){
    try { localStorage.setItem(IMPORT_KEY, JSON.stringify(puzzles)); }
    catch(e){ alert('Failed to save imported puzzles: '+e.message); }
  }
  function loadImported(){
    try { return JSON.parse(localStorage.getItem(IMPORT_KEY) || '[]'); } catch{ return []; }
  }

  // Lichess CSV columns (typical): PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
  function parseLichessCSV(text){
    const lines = text.split(/\r?\n/).filter(Boolean);
    const out = [];
    const header = lines[0].split(',');
    const idx = (name)=> header.indexOf(name);
    const iId = idx('PuzzleId'), iFEN = idx('FEN'), iMoves = idx('Moves'), iRating = idx('Rating'), iThemes = idx('Themes');
    for(let r=1;r<lines.length;r++){
      const row = csvSplit(lines[r]);
      const id = row[iId] || ('csv-'+r);
      const fen = row[iFEN]; if(!fen) continue;
      const moves = (row[iMoves]||'').trim().split(/\s+/).filter(Boolean);
      const rating = +(row[iRating]||1200);
      const themes = (row[iThemes]||'').split(/;/).filter(Boolean).map(s=>s.toLowerCase());
      const side = fen.split(' ')[1]||'w';
      out.push({ id: 'lichess-'+id, fen, side, rating, themes, source: 'Lichess '+id, best: moves.slice(0,2) });
    }
    return out;
  }

  function csvSplit(line){
    const res=[]; let cur=''; let inside=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){
        if(inside && line[i+1]==='"'){ cur+='"'; i++; }
        else { inside=!inside; }
      } else if(ch===',' && !inside){ res.push(cur); cur=''; }
      else { cur+=ch; }
    }
    res.push(cur); return res;
  }

  // PGN file -> create practice puzzles at tactical moments (captures or checks)
  function parsePGNToPuzzles(text){
    const games = text.split(/\n\s*\n\s*\[/).map((seg,idx)=> (idx===0? seg : '['+seg)).filter(s=>/\[Event/.test(s));
    const out = [];
    for(const pgn of games){
      try{
        const ch = new Chess(); ch.load_pgn(pgn);
        const moves = ch.history({ verbose: true });
        const sideStart = 'w'; const base = new Chess(); base.load_pgn(pgn);
        for(let i=0;i<moves.length;i++){
          const san = moves[i].san || '';
          if(san.includes('x') || san.includes('+') || san.includes('#')){
            const pre = new Chess(); pre.load_pgn(pgn);
            for(let j=0;j<i;j++){ pre.move(moves[j]); }
            const fen = pre.fen(); const side = fen.split(' ')[1];
            out.push({ id: `pgn-${hash(pgn)}-${i+1}`, fen, side, rating: 1400, themes: guessThemesFromSAN(san), source: 'PGN import', best: [moves[i].from+moves[i].to+(moves[i].promotion||'')] });
          }
        }
      }catch{}
    }
    return out;
  }

  function guessThemesFromSAN(san){
    const t=[]; if(san.includes('#')) t.push('mate'); if(san.includes('+')) t.push('check'); if(san.includes('x')) t.push('capture'); return t;
  }
  function hash(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))|0; } return (h>>>0).toString(36); }

  function bindUI(){
    const file = document.getElementById('import-file');
    const btn = document.getElementById('btn-import-puzzles');
    const useBtn = document.getElementById('btn-use-imported');
    const status = document.getElementById('import-status');

    if(btn){
      btn.addEventListener('click', async ()=>{
        if(!file.files || !file.files[0]){ alert('Choose a .csv or .pgn file first.'); return; }
        const f = file.files[0]; const text = await f.text();
        let puzzles=[];
        if(/\.csv$/i.test(f.name)) puzzles = parseLichessCSV(text);
        else if(/\.pgn$/i.test(f.name)) puzzles = parsePGNToPuzzles(text);
        else { alert('Unsupported file type. Use .csv or .pgn'); return; }
        if(!puzzles.length){ alert('No puzzles parsed.'); return; }
        const existing = loadImported();
        const merged = dedupe(existing.concat(puzzles));
        saveImported(merged);
        status.textContent = `Imported ${puzzles.length} puzzles. Total stored: ${merged.length}.`;
      });
    }
    if(useBtn){ useBtn.addEventListener('click', ()=>{ alert('Imported puzzles will be included when "Include Imported" is enabled in Puzzle Mode > Custom.'); }); }
  }

  function dedupe(arr){ const seen=new Set(); const out=[]; for(const p of arr){ if(!seen.has(p.id)){ seen.add(p.id); out.push(p); } } return out; }

  function getImported(){ return loadImported(); }

  function init(){ bindUI(); }

  window.Importer = { init, getImported };
})();

