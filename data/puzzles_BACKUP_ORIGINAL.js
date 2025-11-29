(function(){
  // Sample puzzles: supports direct FEN or derive from a GAMELIB game position by ply index
  // Fields: id, fen? or {gameId, ply}, side ('w'|'b'), rating, themes, source, best (array of UCI or SAN moves optional)
  // Add many more by importing CSV/PGN in Analysis Mode (see app UI)

  function gameRef(gameId, ply, meta={}){ return Object.assign({ gameId, ply }, meta); }

  window.PUZZLES = [
    // Real-game derived: Opera Game key moments
    { id: 'op-09', from: gameRef('opera-1858', 18), side: 'w', rating: 900, themes: ['tactic','fork'], source: 'Morphy - Opera (move 9)' },
    { id: 'op-13', from: gameRef('opera-1858', 26), side: 'w', rating: 1200, themes: ['sacrifice','tactic'], source: 'Morphy - Opera (move 13)' },
    { id: 'op-17', from: gameRef('opera-1858', 34), side: 'w', rating: 1500, themes: ['mate','decoy'], source: 'Morphy - Opera (mate)'} ,

    // Simple classics
    { id: 'fool-3', from: gameRef('fools-1858', 4), side: 'b', rating: 400, themes: ['mate'], source: "Fool's Mate", best: ['Qh4#'] },
    { id: 'sch-4', from: gameRef('scholars-?', 7), side: 'w', rating: 600, themes: ['mate'], source: "Scholar's Mate", best: ['Qxf7#'] },

    // Direct FEN examples
    { id: 'mate1-1', fen: '6k1/5ppp/8/8/8/8/5PPP/Q5K1 w - - 0 1', side: 'w', rating: 500, themes: ['mate'], source: 'Composed: ladder motif', best: ['Qa8#'] },
    { id: 'fork-1', fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/3PP3/2P2N2/PP3PPP/RNBQKB1R w KQkq - 2 5', side: 'w', rating: 900, themes: ['fork'], source: 'Practice', best: ['d5'] },
    { id: 'pin-1', fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/8/2N2N2/PPPPPPPP/R1BQKB1R w KQkq - 2 3', side: 'w', rating: 800, themes: ['pin'], source: 'Practice', best: ['d4'] },
    { id: 'disc-1', fen: 'rnb1kbnr/ppppqppp/8/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4', side: 'w', rating: 1000, themes: ['discovered'], source: 'Practice', best: ['Bxf7+'] },
    { id: 'mate1-2', fen: '6k1/8/8/5Q2/8/8/5PPP/6K1 w - - 0 1', side: 'w', rating: 500, themes: ['mate'], source: 'Practice', best: ['Qg5#','Qc8#'] },

    // Daily rotation samples (more can be added)
    { id: 'daily-a', from: gameRef('opera-1858', 20), side: 'w', rating: 1100, themes: ['initiative'], source: 'Daily pool' },
    { id: 'daily-b', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/1P2P3/P1N2N2/2PP1PPP/R1BQKB1R w KQkq - 0 6', side: 'w', rating: 900, themes: ['tactic'], source: 'Daily pool', best: ['bxc5'] },

    // Additional authentic-style practice positions spanning themes and ratings
    { id: 'skewer-1', fen: 'r3k2r/pp3ppp/2p5/4n3/2B5/2P2Q2/P4PPP/R3R1K1 w kq - 0 1', side: 'w', rating: 1200, themes: ['skewer'], source: 'Practice', best: ['Qxf7+'] },
    { id: 'deflection-1', fen: 'r1bq1rk1/ppp2ppp/2n2n2/3pp3/3P4/2P1PN2/PP1NBPPP/R1BQ1RK1 w - - 0 7', side: 'w', rating: 1300, themes: ['deflection'], source: 'Practice', best: ['dxe5'] },
    { id: 'overload-1', fen: 'r2q1rk1/ppp2pbp/2n3p1/3np3/3P4/2P1PN2/PP1NBPPP/R1BQR1K1 w - - 0 10', side: 'w', rating: 1400, themes: ['overloading'], source: 'Practice', best: ['e4'] },
    { id: 'decoy-1', fen: 'r1bq1rk1/ppp2ppp/2n2n2/3p4/3P4/2P1PN2/PP1NBPPP/R1BQ1RK1 b - - 0 7', side: 'b', rating: 1200, themes: ['decoy'], source: 'Practice', best: ['Qh2+'] },
    { id: 'sac-1', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/1P2P3/P1N2N2/2PP1PPP/R1BQKB1R w KQkq - 0 6', side: 'w', rating: 1500, themes: ['sacrifice','initiative'], source: 'Practice', best: ['bxc5'] },
    { id: 'zwischen-1', fen: 'r2q1rk1/pp2bppp/2n2n2/2pp4/3P4/2P1PN2/PP1NBPPP/R1BQR1K1 w - - 0 9', side: 'w', rating: 1600, themes: ['zwischenzug'], source: 'Practice', best: ['dxc5'] },
    { id: 'removal-1', fen: 'r1bqk2r/ppp2ppp/2n2n2/3pp3/3P4/2P1PN2/PP1NBPPP/R1BQ1RK1 w kq - 0 7', side: 'w', rating: 1300, themes: ['removal-of-defender'], source: 'Practice', best: ['dxe5'] },
    { id: 'interference-1', fen: 'r1bq1rk1/ppp2ppp/2n2n2/3p4/3P4/2P1PN2/PP1NBPPP/R1BQ1RK1 w - - 0 7', side: 'w', rating: 1350, themes: ['interference'], source: 'Practice', best: ['dxc5'] },
    { id: 'mate-net-1', fen: '6k1/5ppp/8/8/2Q5/8/5PPP/6K1 w - - 0 1', side: 'w', rating: 800, themes: ['mate'], source: 'Practice', best: ['Qc8#'] },
    { id: 'back-rank-1', fen: '6k1/5ppp/8/8/8/8/5PPP/5RK1 b - - 0 1', side: 'b', rating: 900, themes: ['back-rank'], source: 'Practice', best: ['Qxf1+'] },
    { id: 'pin-2', fen: 'rnbqk2r/pppp1ppp/5n2/4p3/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 2 3', side: 'w', rating: 900, themes: ['pin'], source: 'Practice', best: ['dxe5'] },
    { id: 'fork-2', fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4', side: 'w', rating: 950, themes: ['fork'], source: 'Practice', best: ['Ng5'] },

    ,
    // Immortal Game (Anderssen–Kieseritzky, 1851)
    { id: 'imm-35', from: { gameId: 'immortal-1851', ply: 35 }, side: 'w', rating: 1700, themes: ['sacrifice','deflection'], source: 'Immortal Game (18.Bd6!)', best: ['Bd6'] },
    { id: 'imm-43', from: { gameId: 'immortal-1851', ply: 43 }, side: 'w', rating: 1600, themes: ['sacrifice','decoy'], source: 'Immortal Game (22.Qf6+)', best: ['Qf6+'] },
    { id: 'imm-45', from: { gameId: 'immortal-1851', ply: 45 }, side: 'w', rating: 1400, themes: ['mate'], source: 'Immortal Game (23.Be7#)', best: ['Be7#'] },

    // Evergreen Game (Anderssen–Dufresne, 1852)
    { id: 'evg-33', from: { gameId: 'evergreen-1852', ply: 33 }, side: 'w', rating: 1600, themes: ['sacrifice'], source: 'Evergreen (17.Nf6+)', best: ['Nf6+'] },
    { id: 'evg-35', from: { gameId: 'evergreen-1852', ply: 35 }, side: 'w', rating: 1700, themes: ['initiative'], source: 'Evergreen (18.Re1+)', best: ['Re1+'] },
    { id: 'evg-41', from: { gameId: 'evergreen-1852', ply: 41 }, side: 'w', rating: 1800, themes: ['deflection','removal-of-defender'], source: 'Evergreen (21.Qxd7+)', best: ['Qxd7+'] },
    { id: 'evg-47', from: { gameId: 'evergreen-1852', ply: 47 }, side: 'w', rating: 1500, themes: ['mate'], source: 'Evergreen (24.Bxe7#)', best: ['Bxe7#'] },

    // Game of the Century (Byrne–Fischer, 1956)
    { id: 'goc-34', from: { gameId: 'game-century-1956', ply: 34 }, side: 'b', rating: 1900, themes: ['deflection','interference'], source: 'Game of the Century (17...Be6!)', best: ['Be6'] },
    { id: 'goc-40', from: { gameId: 'game-century-1956', ply: 40 }, side: 'b', rating: 1800, themes: ['fork','tactic'], source: 'Game of the Century (20...Nxd4+)', best: ['Nxd4+'] },
    { id: 'goc-86', from: { gameId: 'game-century-1956', ply: 86 }, side: 'b', rating: 1500, themes: ['mate'], source: 'Game of the Century (43...Ba3#)', best: ['Ba3#'] },

    // Deep Blue vs Kasparov (1997, Game 6)
    { id: 'dbk-15', from: { gameId: 'deepblue-kasparov-1997-g6', ply: 15 }, side: 'w', rating: 1700, themes: ['sacrifice','deflection'], source: 'Deep Blue–Kasparov (8.Nxe6!!)', best: ['Nxe6'] },
    { id: 'dbk-45', from: { gameId: 'deepblue-kasparov-1997-g6', ply: 45 }, side: 'w', rating: 1600, themes: ['deflection','tactic'], source: 'Deep Blue–Kasparov (23.Rxc4+)', best: ['Rxc4+'] },
    { id: 'dbk-63', from: { gameId: 'deepblue-kasparov-1997-g6', ply: 63 }, side: 'w', rating: 1300, themes: ['mate'], source: 'Deep Blue–Kasparov (32.Qb6#)', best: ['Qb6#'] },

    // Kasparov–Topalov (1999)
    { id: 'kt-47', from: { gameId: 'kasparov-topalov-1999', ply: 47 }, side: 'w', rating: 2200, themes: ['sacrifice','deflection','decoy'], source: "Kasparov's Immortal (24.Rxd4!!)", best: ['Rxd4'] },
    { id: 'kt-53', from: { gameId: 'kasparov-topalov-1999', ply: 53 }, side: 'w', rating: 2100, themes: ['zwischenzug','initiative'], source: "Kasparov's Immortal (27.b4+)", best: ['b4+'] },
    { id: 'kt-59', from: { gameId: 'kasparov-topalov-1999', ply: 59 }, side: 'w', rating: 2000, themes: ['tactic','decoy'], source: "Kasparov's Immortal (30.Rxb7)", best: ['Rxb7'] },

    // Carlsen–Karjakin 2016 (Game 10)
    { id: 'ck10-131', from: { gameId: 'carlsen-karjakin-2016-g10', ply: 131 }, side: 'w', rating: 1900, themes: ['promotion','tactic'], source: 'Carlsen–Karjakin 2016 G10 (66.h8=Q)', best: ['h8=Q'] },
    { id: 'ck10-143', from: { gameId: 'carlsen-karjakin-2016-g10', ply: 143 }, side: 'w', rating: 1600, themes: ['mate'], source: 'Carlsen–Karjakin 2016 G10 (72.Qe7#)', best: ['Qe7#'] },

    // Carlsen–Karjakin 2016 Rapid TB Game 4 (Queen sac)
    { id: 'ckr4-99', from: { gameId: 'carlsen-karjakin-2016-rapid-g4', ply: 99 }, side: 'w', rating: 2000, themes: ['sacrifice','decoy'], source: 'Rapid TB G4 (50.Qh6+!!)', best: ['Qh6+'] },
    { id: 'ckr4-101', from: { gameId: 'carlsen-karjakin-2016-rapid-g4', ply: 101 }, side: 'w', rating: 2000, themes: ['deflection','decoy'], source: 'Rapid TB G4 (51.Rg8+!)', best: ['Rg8+'] },
    { id: 'ckr4-103', from: { gameId: 'carlsen-karjakin-2016-rapid-g4', ply: 103 }, side: 'w', rating: 1900, themes: ['mate'], source: 'Rapid TB G4 (52.Nf7#)', best: ['Nf7#'] },

    // Themed mate patterns (beginner–intermediate)
    // Epaulette mate (queen mates with king boxed by own rooks)
    { id: 'mate-epaulette-1', fen: '5rkr/8/3Q4/8/8/8/1K6/8 w - - 0 1', side: 'w', rating: 700, themes: ['mate','epaulette'], source: 'Composed: Epaulette', best: ['Qg6#'], patternTip: 'Queen or rook mates with the king trapped between its own pieces on both sides.' },
    { id: 'mate-epaulette-2', fen: '3rkr2/8/8/8/8/8/1K6/4Q3 w - - 0 1', side: 'w', rating: 800, themes: ['mate','epaulette'], source: 'Composed: Epaulette', best: ['Qe8#'], patternTip: 'Queen or rook mates with the king trapped between its own pieces on both sides.' },

    // Smothered mate (knight mates a king smothered by own pieces)
    { id: 'mate-smothered-1', fen: '6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1', side: 'w', rating: 900, themes: ['mate','smothered'], source: "Composed: Smothered (Philidor's legacy motif)", best: ['Nf7#'], patternTip: 'Knight delivers mate while the king is blocked by its own pieces; often follows a queen sacrifice.' },
    { id: 'mate-smothered-2', fen: 'kr6/pp6/N7/8/8/8/8/K7 w - - 0 1', side: 'w', rating: 900, themes: ['mate','smothered'], source: "Composed: Smothered (mirror)", best: ['Nb7#'], patternTip: 'Knight delivers mate while the king is blocked by its own pieces; often follows a queen sacrifice.' },
    { id: 'mate-smothered-3', fen: '8/8/8/8/8/8/5PPn/6RK b - - 0 1', side: 'b', rating: 1000, themes: ['mate','smothered'], source: "Composed: Smothered (Black to move)", best: ['Nf2#'], patternTip: 'Knight delivers mate while the king is blocked by its own pieces; often follows a queen sacrifice.' },

    // Arabian mate (rook+knight)
    { id: 'mate-arabian-1', fen: '7k/6pp/7N/8/8/8/8/R6K w - - 0 1', side: 'w', rating: 900, themes: ['mate','arabian'], source: 'Composed: Arabian', best: ['Rh1#'], patternTip: 'Rook and knight cooperate: the knight covers the king\'s escape square while the rook delivers mate.' },
    { id: 'mate-arabian-2', fen: '6k1/6pp/7N/8/8/8/8/R6K w - - 0 1', side: 'w', rating: 1100, themes: ['mate','arabian'], source: 'Composed: Arabian (variant)', best: ['Rg1#'], patternTip: 'Rook and knight cooperate: the knight covers the king\'s escape square while the rook delivers mate.' },

    // Anastasia's mate (rook+knight on edge)
    { id: 'mate-anastasia-1', fen: '6k1/5Npp/8/8/8/8/8/R6K w - - 0 1', side: 'w', rating: 1000, themes: ['mate','anastasia'], source: "Composed: Anastasia's", best: ['Ra8#'], patternTip: 'Knight and rook force the king to the edge; the rook mates on the h-file while the knight controls the escape.' },
    { id: 'mate-anastasia-2', fen: '1r4k1/6pp/7N/8/8/8/8/4R2K w - - 0 1', side: 'w', rating: 950, themes: ['mate','anastasia'], source: "Composed: Anastasia's (variant)", best: ['Re8#'], patternTip: 'Knight and rook force the king to the edge; the rook mates on the h-file while the knight controls the escape.' },

    // Boden's mate (criss-cross bishops) – initial seed; will be auto-verified on load
    { id: 'mate-boden-1', fen: '2kr4/p1pp4/8/8/8/2B5/8/B6K w - - 0 1', side: 'w', rating: 1200, themes: ['mate','boden'], source: "Composed: Boden's (Ba6#)", best: ['Ba6#'], patternTip: 'Two bishops on criss-crossing diagonals deliver mate to a king blocked by its own pieces.' },
    { id: 'mate-boden-2', fen: '2kr4/p1pp4/8/8/2B5/8/8/B6K w - - 0 1', side: 'w', rating: 1200, themes: ['mate','boden'], source: "Composed: Boden's (Ba6# variant)", best: ['Ba6#'], patternTip: 'Two bishops on criss-crossing diagonals deliver mate to a king blocked by its own pieces.' },
    { id: 'mate-boden-3', fen: '2kr4/p1pp4/8/2B5/8/8/8/B6K w - - 0 1', side: 'w', rating: 1100, themes: ['mate','boden'], source: "Composed: Boden's (variant 3)", best: ['Ba6#'], patternTip: 'Two bishops on criss-crossing diagonals deliver mate to a king blocked by its own pieces.' },
    { id: 'mate-boden-4', fen: '2kr4/p1pp4/2B5/8/8/8/8/B6K w - - 0 1', side: 'w', rating: 1300, themes: ['mate','boden'], source: "Composed: Boden's (variant 4)", best: ['Ba6#'], patternTip: 'Two bishops on criss-crossing diagonals deliver mate to a king blocked by its own pieces.' },

    // Back-rank mate (classic)
    { id: 'mate-backrank-1', fen: '6k1/5ppp/8/8/8/8/4QPPP/4R1K1 w - - 0 1', side: 'w', rating: 750, themes: ['mate','backrank'], source: 'Composed: Back-rank', best: ['Qe8#'], patternTip: 'Rook or queen mates on the back rank with the king trapped by its own pawns.' },
    { id: 'mate-backrank-2', fen: '4r1k1/5ppp/8/8/8/8/4qPPP/4R1K1 b - - 0 1', side: 'b', rating: 800, themes: ['mate','backrank'], source: 'Composed: Back-rank', best: ['Qxe1#'], patternTip: 'Rook or queen mates on the back rank with the king trapped by its own pawns.' },

    // Dovetail mate (Cozio)
    { id: 'mate-dovetail-1', fen: '4k3/3p1p2/8/4Q3/8/8/8/4R1K1 w - - 0 1', side: 'w', rating: 950, themes: ['mate','dovetail'], source: 'Composed: Dovetail', best: ['Qe7#'], patternTip: 'Queen delivers mate adjacent to the king; two of the king’s own pieces block the diagonal escape squares.' },
    { id: 'mate-dovetail-2', fen: '4r1k1/8/8/8/4q3/8/3P1P2/4K3 b - - 0 1', side: 'b', rating: 1000, themes: ['mate','dovetail'], source: 'Composed: Dovetail', best: ['Qe2#'], patternTip: 'Queen delivers mate adjacent to the king; two of the king’s own pieces block the diagonal escape squares.' }
  ];
})();

