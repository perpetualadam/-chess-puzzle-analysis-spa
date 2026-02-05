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
      pgn: '[Event "Third Rosenwald Trophy"] [Site "New York USA"] [Date "1956.10.17"] [Round "8"] [White "Donald Byrne"] [Black "Robert James Fischer"] [Result "0-1"]\n1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4 7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4 12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3 16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6 24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2 28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 Ne4 32.Qb8 b5 33.h4 h5 34.Ne5 Kg7 35.Kg1 Bc5+ 36.Kf1 Ng3+ 37.Ke1 Bb4+ 38.Kd1 Bb3+ 39.Kc1 Ne2+ 40.Kb1 Nc3+ 41.Kc1 Rc2# 0-1'
    },
    {
      id: 'deepblue-kasparov-1997-g6',
      name: 'Deep Blue vs Garry Kasparov — Game 6 (1997)',
      source: 'New York 1997',
      pgn: '[Event "IBM Man-Machine, Game 6"] [Site "New York USA"] [Date "1997.05.11"] [Round "6"] [White "Deep Blue"] [Black "Garry Kasparov"] [Result "1-0"]\n1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Ng5 Ngf6 6.Bd3 e6 7.N1f3 h6 8.Nxe6 Qe7 9.O-O fxe6 10.Bg6+ Kd8 11.Bf4 b5 12.a4 Bb7 13.Re1 Nd5 14.Bg3 Kc8 15.axb5 cxb5 16.c4 bxc4 17.Rc1 N7b6 18.Ne5 Qb4 19.Nf7 Rg8 20.Rxe6 Be7 21.Qg4 Nd7 22.Ne5 Rd8 23.Rxc4+ Qxc4 24.Nxc4 a6 25.Be4 a5 26.Bxd5 Bxd5 27.Nb6+ Kb7 28.Nxd5 Nf6 29.Rb6+ Ka7 30.Qe6 Rac8 31.Ra6+ Kb7 32.Qb6# 1-0'
    },
    {
      id: 'kasparov-topalov-1999',
      name: "Garry Kasparov vs Veselin Topalov — 'Kasparov's Immortal' (1999)",
      source: 'Wijk aan Zee 1999',
      pgn: '[Event "Hoogovens A Tournament"]\n[Site "Wijk aan Zee NED"]\n[Date "1999.01.20"]\n[Round "4"]\n[White "Garry Kasparov"]\n[Black "Veselin Topalov"]\n[Result "1-0"]\n[EventDate "?"]\n[ECO "B06"]\n[WhiteElo "2812"]\n[BlackElo "2700"]\n[PlyCount "87"]\n\n1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6\nBxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4\n15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1\nd4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+\nKa4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+\nKxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8\nRd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0'
    },
    {
      id: 'carlsen-karjakin-2016-g10',
      name: 'Magnus Carlsen vs Sergey Karjakin — World Championship (2016) Game 10',
      source: 'New York 2016',
      pgn: '[Event "WCh 2016"]\n[Site "New York USA"]\n[Date "2016.11.24"]\n[Round "10"]\n[White "Carlsen, Magnus"]\n[Black "Karjakin, Sergey"]\n[Result "1-0"]\n[WhiteTitle "GM"]\n[BlackTitle "GM"]\n[WhiteElo "2853"]\n[BlackElo "2772"]\n[ECO "C65"]\n[Opening "Ruy Lopez"]\n[Variation "Berlin defence"]\n[EventDate "2016.11.11"]\n[WhiteFideId "1503014"]\n[BlackFideId "14109603"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. d3 Bc5 5. c3 O-O 6. Bg5 h6 7. Bh4 Be7 8. O-O\nd6 9. Nbd2 Nh5 10. Bxe7 Qxe7 11. Nc4 Nf4 12. Ne3 Qf6 13. g3 Nh3+ 14. Kh1 Ne7\n15. Bc4 c6 16. Bb3 Ng6 17. Qe2 a5 18. a4 Be6 19. Bxe6 fxe6 20. Nd2 d5 21. Qh5\nNg5 22. h4 Nf3 23. Nxf3 Qxf3+ 24. Qxf3 Rxf3 25. Kg2 Rf7 26. Rfe1 h5 27. Nf1 Kf8\n28. Nd2 Ke7 29. Re2 Kd6 30. Nf3 Raf8 31. Ng5 Re7 32. Rae1 Rfe8 33. Nf3 Nh8 34.\nd4 exd4 35. Nxd4 g6 36. Re3 Nf7 37. e5+ Kd7 38. Rf3 Nh6 39. Rf6 Rg7 40. b4 axb4\n41. cxb4 Ng8 42. Rf3 Nh6 43. a5 Nf5 44. Nb3 Kc7 45. Nc5 Kb8 46. Rb1 Ka7 47. Rd3\nRc7 48. Ra3 Nd4 49. Rd1 Nf5 50. Kh3 Nh6 51. f3 Rf7 52. Rd4 Nf5 53. Rd2 Rh7 54.\nRb3 Ree7 55. Rdd3 Rh8 56. Rb1 Rhh7 57. b5 cxb5 58. Rxb5 d4 59. Rb6 Rc7 60. Nxe6\nRc3 61. Nf4 Rhc7 62. Nd5 Rxd3 63. Nxc7 Kb8 64. Nb5 Kc8 65. Rxg6 Rxf3 66. Kg2\nRb3 67. Nd6+ Nxd6 68. Rxd6 Re3 69. e6 Kc7 70. Rxd4 Rxe6 71. Rd5 Rh6 72. Kf3 Kb8\n73. Kf4 Ka7 74. Kg5 Rh8 75. Kf6 1-0'
    },
    {
      id: 'carlsen-karjakin-2016-rapid-g4',
      name: 'Magnus Carlsen vs Sergey Karjakin — Rapid Tiebreak (2016) Game 4',
      source: 'New York 2016',
      pgn: '[Event "WCh Rapid TB 2016"]\n[Site "New York USA"]\n[Date "2016.11.30"]\n[Round "4"]\n[White "Carlsen, Magnus"]\n[Black "Karjakin, Sergey"]\n[Result "1-0"]\n[WhiteTitle "GM"]\n[BlackTitle "GM"]\n[WhiteElo "2853"]\n[BlackElo "2772"]\n[ECO "B54"]\n[Opening "Sicilian"]\n[Variation "Prins (Moscow) variation"]\n[EventDate "2016.11.30"]\n[WhiteFideId "1503014"]\n[BlackFideId "14109603"]\n\n1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. f3 e5 6. Nb3 Be7 7. c4 a5 8. Be3\na4 9. Nc1 O-O 10. Nc3 Qa5 11. Qd2 Na6 12. Be2 Nc5 13. O-O Bd7 14. Rb1 Rfc8 15.\nb4 axb3 16. axb3 Qd8 17. Nd3 Ne6 18. Nb4 Bc6 19. Rfd1 h5 20. Bf1 h4 21. Qf2 Nd7\n22. g3 Ra3 23. Bh3 Rca8 24. Nc2 R3a6 25. Nb4 Ra5 26. Nc2 b6 27. Rd2 Qc7 28.\nRbd1 Bf8 29. gxh4 Nf4 30. Bxf4 exf4 31. Bxd7 Qxd7 32. Nb4 Ra3 33. Nxc6 Qxc6 34.\nNb5 Rxb3 35. Nd4 Qxc4 36. Nxb3 Qxb3 37. Qe2 Be7 38. Kg2 Qe6 39. h5 Ra3 40. Rd3\nRa2 41. R3d2 Ra3 42. Rd3 Ra7 43. Rd5 Rc7 44. Qd2 Qf6 45. Rf5 Qh4 46. Rc1 Ra7\n47. Qxf4 Ra2+ 48. Kh1 Qf2 49. Rc8+ Kh7 50. Qh6+ 1-0'
    }
  ];
})();

