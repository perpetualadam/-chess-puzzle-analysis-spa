/**
 * Main Application Entry Point (Refactored)
 * Performance-optimized with modern architecture
 */

import { CONFIG } from './config.js';
import { $, $$, addListener, toggleClass, toggleVisibility } from './utils/dom.js';
import { debounce, throttle } from './utils/performance.js';
import { engineService } from './services/EngineService.js';
import { stateManager } from './core/StateManager.js';
import { eventBus, EVENTS } from './core/EventBus.js';
import { safe } from './utils/errors.js';

/**
 * Application class
 */
class ChessApp {
  constructor() {
    this.board = null;
    this.currentMode = 'puzzle';
    this.cleanupFunctions = [];
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log(`[App] Initializing ${CONFIG.APP_NAME} v${CONFIG.VERSION}`);
    
    try {
      // Initialize core services
      await this.initEngine();
      this.initBoard();
      this.initNavigation();
      this.initSettings();
      this.initMobileUI();
      this.initEventListeners();
      
      // Initialize modes (will be refactored separately)
      if (window.PuzzleMode) PuzzleMode.init(engineService);
      if (window.AnalysisMode) AnalysisMode.init(engineService);
      if (window.HallOfFame) HallOfFame.init();
      if (window.Importer) Importer.init();
      
      console.log('[App] Initialization complete');
    } catch (error) {
      console.error('[App] Initialization failed:', error);
      alert('Failed to initialize app. Please refresh the page.');
    }
  }

  /**
   * Initialize chess engine
   */
  async initEngine() {
    console.log('[App] Starting engine...');
    
    try {
      await engineService.start();
      
      // Listen for engine events
      eventBus.on(EVENTS.ENGINE_READY, () => {
        console.log('[App] Engine ready');
      });
      
      eventBus.on(EVENTS.ENGINE_ERROR, (error) => {
        console.error('[App] Engine error:', error);
        alert('Chess engine error. Some features may not work.');
      });
      
      // Bind engine controls
      const startBtn = $('#engine-start');
      const stopBtn = $('#engine-stop');
      
      if (startBtn) {
        this.cleanupFunctions.push(
          addListener(startBtn, 'click', () => engineService.start())
        );
      }
      
      if (stopBtn) {
        this.cleanupFunctions.push(
          addListener(stopBtn, 'click', () => engineService.stop())
        );
      }
      
    } catch (error) {
      console.error('[App] Engine initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize chess board
   */
  initBoard() {
    const boardEl = $('#board');
    if (!boardEl) {
      console.error('[App] Board element not found');
      return;
    }

    const settings = stateManager.get('settings');
    
    this.board = Chessboard('board', {
      draggable: false,
      position: 'start',
      pieceTheme: `https://chessboardjs.com/img/chesspieces/${settings.pieceSet}/{piece}.png`
    });

    window.__BOARD__ = this.board;
    console.log('[App] Board initialized');
  }

  /**
   * Initialize navigation
   */
  initNavigation() {
    const navButtons = $$('.nav-btn');
    
    navButtons.forEach(btn => {
      this.cleanupFunctions.push(
        addListener(btn, 'click', (e) => {
          const target = e.target.dataset.target;
          this.switchMode(target);
        })
      );
    });
  }

  /**
   * Switch between modes
   * @param {string} sectionId - Section ID to show
   */
  switchMode(sectionId) {
    // Update nav buttons
    $$('.nav-btn').forEach(btn => {
      toggleClass(btn, 'active', btn.dataset.target === sectionId);
    });

    // Update sections
    $$('.mode-section').forEach(section => {
      toggleVisibility(section, section.id === sectionId);
    });

    // Update current mode
    this.currentMode = sectionId.replace('-section', '');
    stateManager.set('preferences.lastMode', this.currentMode);
    
    eventBus.emit(EVENTS.MODE_CHANGED, this.currentMode);
  }

  /**
   * Initialize settings
   */
  initSettings() {
    const settingsBtn = $('#btn-settings');
    const settingsPanel = $('#settings-panel');
    const saveBtn = $('#save-settings');

    if (settingsBtn && settingsPanel) {
      this.cleanupFunctions.push(
        addListener(settingsBtn, 'click', () => {
          const isHidden = settingsPanel.hidden;
          toggleVisibility(settingsPanel, isHidden);
        })
      );
    }

    if (saveBtn) {
      this.cleanupFunctions.push(
        addListener(saveBtn, 'click', () => this.saveSettings())
      );
    }

    this.loadSettings();
  }

  /**
   * Load settings from state
   */
  loadSettings() {
    const settings = stateManager.get('settings');
    
    const themeSelect = $('#setting-board-theme');
    const pieceSelect = $('#setting-piece-set');
    const depthInput = $('#setting-depth');
    const multipvInput = $('#setting-multipv');
    const timerCheckbox = $('#setting-timer-enabled');
    const timerSecondsInput = $('#setting-timer-seconds');
    const scoringCheckbox = $('#setting-scoring-enabled');

    if (themeSelect) themeSelect.value = settings.theme;
    if (pieceSelect) pieceSelect.value = settings.pieceSet;
    if (depthInput) depthInput.value = settings.depth;
    if (multipvInput) multipvInput.value = settings.multipv;
    if (timerCheckbox) timerCheckbox.checked = settings.timerEnabled;
    if (timerSecondsInput) timerSecondsInput.value = settings.timerSeconds;
    if (scoringCheckbox) scoringCheckbox.checked = settings.scoringEnabled;
  }

  /**
   * Save settings to state
   */
  saveSettings() {
    const settings = {
      theme: $('#setting-board-theme')?.value || CONFIG.BOARD.DEFAULT_THEME,
      pieceSet: $('#setting-piece-set')?.value || CONFIG.BOARD.DEFAULT_PIECE_SET,
      depth: parseInt($('#setting-depth')?.value, 10) || CONFIG.ENGINE.DEFAULT_DEPTH,
      multipv: parseInt($('#setting-multipv')?.value, 10) || CONFIG.ENGINE.DEFAULT_MULTIPV,
      timerEnabled: $('#setting-timer-enabled')?.checked || false,
      timerSeconds: parseInt($('#setting-timer-seconds')?.value, 10) || CONFIG.PUZZLE.DEFAULT_TIMER_SECONDS,
      scoringEnabled: $('#setting-scoring-enabled')?.checked || true,
    };

    stateManager.set('settings', settings);
    eventBus.emit(EVENTS.SETTINGS_SAVED, settings);

    alert(CONFIG.MESSAGES.SETTINGS_SAVED);
    location.reload();
  }

  /**
   * Initialize mobile UI
   */
  initMobileUI() {
    const menuBtn = $('#btn-menu');
    const sidebar = $('.sidebar');

    if (menuBtn && sidebar) {
      this.cleanupFunctions.push(
        addListener(menuBtn, 'click', () => {
          toggleClass(sidebar, 'mobile-visible');
        })
      );
    }

    // Add mobile tabs if they exist
    const tabBtns = $$('.mobile-tabs .tab-btn');
    tabBtns.forEach(btn => {
      this.cleanupFunctions.push(
        addListener(btn, 'click', (e) => {
          const target = e.target.dataset.target;
          this.switchMode(target);
        })
      );
    });
  }

  /**
   * Initialize global event listeners with performance optimizations
   */
  initEventListeners() {
    // Debounced resize handler
    const resizeHandler = debounce(() => {
      try {
        if (window.__BOARD__ && window.__BOARD__.resize) {
          window.__BOARD__.resize();
        }
        if (window.__PUZZLE_BOARD__ && window.__PUZZLE_BOARD__.resize) {
          window.__PUZZLE_BOARD__.resize();
        }
      } catch (error) {
        console.error('[App] Resize error:', error);
      }
    }, CONFIG.PERFORMANCE.RESIZE_DEBOUNCE);

    this.cleanupFunctions.push(
      addListener(window, 'resize', resizeHandler)
    );

    // Listen for state changes
    stateManager.observe('settings', (settings) => {
      console.log('[App] Settings updated:', settings);
    });

    // Listen for mode changes
    eventBus.on(EVENTS.MODE_CHANGED, (mode) => {
      console.log('[App] Mode changed:', mode);
    });
  }

  /**
   * Cleanup function
   */
  cleanup() {
    console.log('[App] Cleaning up...');

    // Run all cleanup functions
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];

    // Stop engine
    engineService.stop();

    // Clear event bus
    eventBus.clear();
  }
}

// Create and initialize app
const app = new ChessApp();

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => app.cleanup());

// Export for debugging
window.__APP__ = app;


