/**
 * Application Configuration
 * Centralized configuration for the Chess Puzzle & Analysis SPA
 */

export const CONFIG = {
  // Application Info
  APP_NAME: 'Chess Puzzle & Analysis',
  VERSION: '2.0.0',
  STORAGE_KEY: 'chess_spa_state_v2',

  // Performance Settings
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,           // ms for debounced events
    THROTTLE_DELAY: 100,           // ms for throttled events
    ANIMATION_DURATION: 200,       // ms for board animations
    MOVE_DELAY: 400,               // ms delay for opponent moves
    ANALYSIS_MOVE_DELAY: 100,      // ms delay between moves during analysis
    RESIZE_DEBOUNCE: 150,          // ms for window resize
    DOM_BATCH_SIZE: 10,            // Number of DOM operations to batch
  },

  // Engine Settings
  ENGINE: {
    WORKER_PATH: 'workers/stockfish.worker.js',
    DEFAULT_DEPTH: 14,
    DEFAULT_DEPTH_MOBILE: 10,
    DEFAULT_MULTIPV: 3,
    DEFAULT_MULTIPV_MOBILE: 2,
    MIN_DEPTH: 4,
    MAX_DEPTH: 30,
    MIN_MULTIPV: 1,
    MAX_MULTIPV: 3,
    INIT_TIMEOUT: 10000,           // ms to wait for engine initialization
  },

  // Board Settings
  BOARD: {
    DEFAULT_THEME: 'brown',
    DEFAULT_PIECE_SET: 'wikipedia',
    THEMES: ['brown', 'green', 'blue', 'gray'],
    PIECE_SETS: ['wikipedia', 'merida'],
    MAX_WIDTH: 640,
    MIN_WIDTH: 320,
  },

  // Puzzle Settings
  PUZZLE: {
    DEFAULT_RATING: 1200,
    DEFAULT_LEVEL: 1,
    MIN_RATING: 400,
    MAX_RATING: 2800,
    RATING_CHANGE_WIN: 20,
    RATING_CHANGE_LOSS: 15,
    DEFAULT_TIMER_SECONDS: 60,
    MIN_TIMER_SECONDS: 10,
    MAX_TIMER_SECONDS: 300,
    TIMER_STEP: 5,
  },

  // Rush Mode Settings
  RUSH: {
    INITIAL_TIME: 180,             // 3 minutes
    MAX_STRIKES: 3,
    TIME_BONUS_CORRECT: 5,         // seconds added for correct answer
    TIME_PENALTY_WRONG: 10,        // seconds removed for wrong answer
  },

  // Battle Mode Settings
  BATTLE: {
    TARGET_SCORE: 5,
    AI_DELAY_MIN: 2000,            // ms
    AI_DELAY_MAX: 5000,            // ms
  },

  // Analysis Settings
  ANALYSIS: {
    BLUNDER_THRESHOLD: 200,        // centipawns
    CHECKMATE_SCORE: 1000,         // centipawns equivalent
    CHART_MAX_MOVES: 100,
  },

  // UI Settings
  UI: {
    MOBILE_BREAKPOINT: 700,        // px
    SIDEBAR_WIDTH: 260,            // px
    TOAST_DURATION: 3000,          // ms
    NOTIFICATION_DURATION: 5000,   // ms
  },

  // Arrow Colors (for board annotations)
  ARROWS: {
    BEST_MOVE: 'rgba(63, 185, 80, 0.7)',      // Green
    OPPONENT_MOVE: 'rgba(239, 68, 68, 0.7)',  // Red
    HINT: 'rgba(59, 130, 246, 0.7)',          // Blue
    ALTERNATIVE: 'rgba(251, 191, 36, 0.7)',   // Yellow
  },

  // CDN URLs
  CDN: {
    JQUERY: 'https://code.jquery.com/jquery-3.5.1.min.js',
    CHESS_JS: 'https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js',
    CHESSBOARD_JS: 'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js',
    CHESSBOARD_CSS: 'https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css',
    CHART_JS: 'https://cdn.jsdelivr.net/npm/chart.js',
  },

  // Feature Flags
  FEATURES: {
    ENABLE_TIMER: true,
    ENABLE_SCORING: true,
    ENABLE_RUSH_MODE: true,
    ENABLE_BATTLE_MODE: true,
    ENABLE_DAILY_PUZZLE: true,
    ENABLE_IMPORT: true,
    ENABLE_EXPORT: true,
    ENABLE_PWA: true,
    ENABLE_OFFLINE: true,
  },

  // Error Messages
  ERRORS: {
    ENGINE_INIT_FAILED: 'Failed to initialize chess engine',
    ENGINE_TIMEOUT: 'Chess engine initialization timeout',
    INVALID_PGN: 'Invalid PGN format',
    INVALID_FEN: 'Invalid FEN position',
    NO_PUZZLES: 'No puzzles available',
    STORAGE_FAILED: 'Failed to save data',
    NETWORK_ERROR: 'Network error occurred',
  },

  // Success Messages
  MESSAGES: {
    PUZZLE_CORRECT: 'Correct! Well done!',
    PUZZLE_INCORRECT: 'Incorrect. Try again!',
    PUZZLE_SOLVED: 'Puzzle solved!',
    SETTINGS_SAVED: 'Settings saved successfully',
    IMPORT_SUCCESS: 'Import successful',
    EXPORT_SUCCESS: 'Export successful',
  },
};

/**
 * Get mobile-optimized settings
 * @returns {boolean} True if mobile device
 */
export function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < CONFIG.UI.MOBILE_BREAKPOINT;
}

/**
 * Get default settings based on device
 * @returns {Object} Default settings object
 */
export function getDefaultSettings() {
  const mobile = isMobile();
  return {
    theme: CONFIG.BOARD.DEFAULT_THEME,
    pieceSet: CONFIG.BOARD.DEFAULT_PIECE_SET,
    depth: mobile ? CONFIG.ENGINE.DEFAULT_DEPTH_MOBILE : CONFIG.ENGINE.DEFAULT_DEPTH,
    multipv: mobile ? CONFIG.ENGINE.DEFAULT_MULTIPV_MOBILE : CONFIG.ENGINE.DEFAULT_MULTIPV,
    timerEnabled: false,
    timerSeconds: CONFIG.PUZZLE.DEFAULT_TIMER_SECONDS,
    scoringEnabled: true,
  };
}

