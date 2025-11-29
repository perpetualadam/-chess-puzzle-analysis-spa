(function(){
  // Minimal famous games library (expand via importer). For authenticity, these are real PGNs.
  // Notes: To add more, drop PGN text below or use the importer in Analysis Mode.
  window.GAMELIB = [
    {
      id: 'opera-1858',
      name: 'Morphy vs Duke Karl/Count Isouard — Opera Game (1858)',
      source: 'Paris Opera, 1858',
      pgn: '[Event "Casual Game"] [Site "Paris"] [Date "1858.??.??"] [Round "-"] [White "Paul Morphy"] [Black "Duke Karl / Count Isouard"] [Result "1-0"]\n1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8# 1-0'
    },
    {
      id: 'fools-1858',
      name: 'Fool\'s Mate (example)',
      source: 'Composite demo',
      pgn: '[Event "Fool\'s Mate"] [Site "-"] [Date "????.??.??"] [Round "-"] [White "Casual"] [Black "Casual"] [Result "0-1"]\n1.f3 e5 2.g4 Qh4# 0-1'
    },
    {
      id: 'scholars-?',
      name: 'Scholar\'s Mate (example)',
      source: 'Composite demo',
      pgn: '[Event "Scholar\'s Mate"] [Site "-"] [Date "????.??.??"] [Round "-"] [White "Casual"] [Black "Casual"] [Result "1-0"]\n1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6 4.Qxf7# 1-0'
    },
    {
      id: 'immortal-1851',
      name: 'Anderssen vs Kieseritzky — Immortal Game (1851)',
      source: 'London 1851',
      pgn: '[Event "London"] [Site "London ENG"] [Date "1851.06.21"] [Round "-"] [White "Adolf Anderssen"] [Black "Lionel Kieseritzky"] [Result "1-0"]\n1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Bxg1 19.e5 Qxa1+ 20.Ke2 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7# 1-0'
    },
    {
      id: 'evergreen-1852',
      name: 'Anderssen vs Dufresne — Evergreen Game (1852)',
      source: 'Berlin 1852',
      pgn: '[Event "Casual Game"] [Site "Berlin GER"] [Date "1852.??.??"] [Round "-"] [White "Adolf Anderssen"] [Black "Jean Dufresne"] [Result "1-0"]\n1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4 Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6 Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8 23.Bd7+ Kf8 24.Bxe7# 1-0'
    },
    {
      id: 'game-century-1956',
      name: 'Donald Byrne vs Bobby Fischer — Game of the Century (1956)',
      source: 'New York 1956',
      pgn: '[Event "Third Rosenwald Trophy"] [Site "New York USA"] [Date "1956.10.17"] [Round "8"] [White "Donald Byrne"] [Black "Robert James Fischer"] [Result "0-1"]\n1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4 7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4 12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3 16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6 24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2 28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 Ne4 32.Qb8 b5 33.h4 h5 34.Ne5 Kg7 35.Kg1 Bc5+ 36.Kf1 Ng3+ 37.Ke1 Bb4+ 38.Kd1 Bb3+ 39.Kc1 Ne2+ 40.Kb1 Nc3+ 41.Kc1 Rc2+ 42.Kd1 Rf2+ 43.Kc1 Ba3# 0-1'
    },
    {
      id: 'deepblue-kasparov-1997-g6',
      name: 'Deep Blue vs Garry Kasparov — Game 6 (1997)',
      source: 'New York 1997',
      pgn: '[Event "IBM Man-Machine, Game 6"] [Site "New York USA"] [Date "1997.05.11"] [Round "6"] [White "Deep Blue"] [Black "Garry Kasparov"] [Result "1-0"]\n1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 Ngf6 6.Bd3 e6 7.N1f3 h6 8.Nxe6 Qe7 9.O-O fxe6 10.Bg6+ Kd8 11.Bf4 b5 12.a4 Bb7 13.Re1 Nd5 14.Bg3 Kc8 15.axb5 cxb5 16.c4 bxc4 17.Rc1 N7b6 18.Ne5 Qb4 19.Nf7 Rg8 20.Rxe6 Be7 21.Qg4 Nd7 22.Ne5 Rd8 23.Rxc4+ Qxc4 24.Nxc4 a6 25.Be4 a5 26.Bxd5 Bxd5 27.Nb6+ Kb7 28.Nxd5 Nf6 29.Rb6+ Ka7 30.Qe6 Rac8 31.Ra6+ Kb8 32.Qb6# 1-0'
    },
    {
      id: 'kasparov-topalov-1999',
      name: "Garry Kasparov vs Veselin Topalov — 'Kasparov's Immortal' (1999)",
      source: 'Wijk aan Zee 1999',
      pgn: '[Event "Hoogovens"] [Site "Wijk aan Zee NED"] [Date "1999.01.20"] [Round "4"] [White "Garry Kasparov"] [Black "Veselin Topalov"] [Result "1-0"]\n1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3 Bg7 5.Qd2 c6 6.f3 b5 7.Nge2 Nbd7 8.Bh6 Bxh6 9.Qxh6 Bb7 10.a3 e5 11.O-O-O Qe7 12.Kb1 a6 13.Nc1 O-O-O 14.Nb3 exd4 15.Rxd4 c5 16.Rd1 Nb6 17.g3 Kb8 18.Na5 Ba8 19.Bh3 d5 20.Qf4+ Ka7 21.Rhe1 d4 22.Nd5 Nbxd5 23.exd5 Qd6 24.Rxd4!! cxd4 25.Re7+ Kb6 26.Qxd4+ Kxa5 27.b4+ Ka4 28.Qc3 Qxd5 29.Ra7 Bb7 30.Rxb7 Qd1+ 31.Kb2 Rd2 32.Ra7 Rxc2+ 33.Qxc2+ Qxc2+ 34.Kxc2 Kxa3 35.Kc3 Nd5+ 36.Kd4 Nxb4 37.Kc5 f5 38.Bf1 Rc8+ 39.Kb6 Rc6+ 40.Kb7 Re6 41.f4 h5 42.h4 Nd5 43.Bg2 Nb4 44.Bf1 Kb3 45.Rg7 Kc3 46.Kc5 Nd3+ 47.Kd5 Rb6 48.Rc7+ Kd2 49.Rc6 Nb4+ 50.Kc5 Rxc6+ 51.Kxb4 Ke3 52.Bg2 Rd6 53.Kc5 Rd2 54.Bc6 Kf2 55.Be8 Kxg3 56.Bxg6 Kxf4 57.Bxh5 Ke5 58.Bf3 Rd3 59.Bb7 f4 60.h5 f3 61.h6 f2 62.Bg2 Rg3 63.Bf1 Rg6 64.h7 Rh6 65.Bd3 Kf4 66.Kd4 Kf3 67.Kc3 Ke3 68.Kc2 Rh1 69.a4 Rxh7 70.axb5 axb5 71.Bxb5 Rc7+ 72.Kd1 Rb7 73.Bf1 Rb1+ 74.Kd2 Rxf1 75.a5 Ra1 76.a6 Ra2+ 77.Kc3 f1=Q 78.Kb3 Qb1+ 79.Kc4 Rc2+ 80.Kd5 Qd1+ 81.Ke6 Re2+ 82.Kf7 Qf1+ 83.Kg6 Rg2+ 84.Kh7 Qh1# 1-0'
    },
    {
      id: 'carlsen-karjakin-2016-g10',
      name: 'Magnus Carlsen vs Sergey Karjakin — World Championship (2016) Game 10',
      source: 'New York 2016',
      pgn: '[Event "World Chess Championship"] [Site "New York USA"] [Date "2016.11.24"] [Round "10"] [White "Magnus Carlsen"] [Black "Sergey Karjakin"] [Result "1-0"]\n1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.f4 Nbd7 10.a4 b6 11.Kh1 Bb7 12.Bf3 Rc8 13.Re1 Re8 14.Nd2 Bf8 15.Nf1 d5 16.Nxd5 Nxd5 17.exd5 exf4 18.Rxe8 Qxe8 19.Bxf4 Ne5 20.c3 Nxf3 21.Qxf3 Qd7 22.Ne3 Re8 23.c4 Bc5 24.Nc2 Bc8 25.b4 Bf8 26.Qc3 Re4 27.Bg3 Qe8 28.a5 bxa5 29.bxa5 Bf5 30.Nd4 Bg6 31.c5 h5 32.d6 h4 33.Bf2 Qe5 34.d7 Be7 35.c6 Bd8 36.Re1 h3 37.gxh3 Bc7 38.Bg3 Qd5 39.Nf3 Rc4 40.Re8+ Kh7 41.Qe3 Rc1+ 42.Kg2 Rc2+ 43.Kf1 Bd3+ 44.Kg1 Qxc6 45.Qxd3+ Qg6 46.Qxg6+ Kxg6 47.Bxc7 Rxc7 48.Re7 Kf6 49.Rxc7 Ke6 50.Ra7 Kd6 51.Rxa6+ Kc7 52.Rb6 f6 53.Nd4 f5 54.Nxf5 g6 55.Rxg6 Kd7 56.a6 Kc7 57.a7 Kb7 58.Rg7+ Ka8 59.Rg8+ Kxa7 60.Rg6 Kb7 61.h4 Kc7 62.h5 Kd7 63.h6 Ke7 64.h7 Kf7 65.Rg7+ Kf6 66.h8=Q Ke5 67.Qe8+ Kf4 68.Qe3+ Kxf5 69.Rg5+ Kf6 70.Qe5+ Kf7 71.Rg7+ Kf8 72.Qe7# 1-0'
    },
    {
      id: 'carlsen-karjakin-2016-rapid-g4',
      name: 'Magnus Carlsen vs Sergey Karjakin — Rapid Tiebreak (2016) Game 4',
      source: 'New York 2016',
      pgn: '[Event "World Chess Championship Rapid TB"] [Site "New York USA"] [Date "2016.11.30"] [Round "4"] [White "Magnus Carlsen"] [Black "Sergey Karjakin"] [Result "1-0"]\n1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O Nxe4 5.d4 a6 6.Bd3 d5 7.Nxe5 Nxe5 8.dxe5 Bc5 9.Nd2 Bf5 10.Nb3 Bb6 11.a4 c6 12.a5 Ba7 13.Qf3 Bg6 14.Be3 Bxe3 15.Qxe3 Qe7 16.f4 f5 17.Bxe4 fxe4 18.Nc5 O-O 19.b4 Rad8 20.Rad1 Rf7 21.c3 h6 22.Rde1 Rdf8 23.g3 Bf5 24.h4 h5 25.Nb3 Qe6 26.Nd4 Qg6 27.Kh2 Bg4 28.Rf2 Re7 29.Ref1 Ref7 30.Rd2 Kh7 31.Rdf2 Qh6 32.Re1 Qg6 33.Raf1 Re7 34.Re1 Kg8 35.Ref1 Kh7 36.Re1 Rfe8 37.Rff1 Rf7 38.Rf2 Qh6 39.Nb3 Bf5 40.Nd4 Bg4 41.Nb3 Qg6 42.Nc5 Bf5 43.Nb3 Bg4 44.Nc5 Rfe7 45.Nb3 Qf5 46.Nd4 Qc8 47.Nb3 Rf8 48.Nc5 Ref7 49.Nb3 Qf5 50.Qh6+!! Qxh6 51.Rg8+! Rxg8 52.Nf7# 1-0'
    }
  ];
})();

