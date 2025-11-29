/**
 * Event Bus
 * Centralized event system for decoupled component communication
 */

/**
 * EventBus class for publish-subscribe pattern
 */
export class EventBus {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    this.events.get(event).push(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event once
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    
    return this.on(event, wrapper);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index > -1) {
      callbacks.splice(index, 1);
    }
    
    // Clean up empty event arrays
    if (callbacks.length === 0) {
      this.events.delete(event);
    }
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[EventBus] Error in ${event} handler:`, error);
      }
    });
  }

  /**
   * Clear all event listeners
   */
  clear() {
    this.events.clear();
  }

  /**
   * Clear listeners for specific event
   * @param {string} event - Event name
   */
  clearEvent(event) {
    this.events.delete(event);
  }

  /**
   * Get number of listeners for an event
   * @param {string} event - Event name
   * @returns {number} Number of listeners
   */
  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }

  /**
   * Get all event names
   * @returns {Array} Event names
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
}

// Global event bus instance
export const eventBus = new EventBus();

/**
 * Event names constants
 */
export const EVENTS = {
  // Puzzle events
  PUZZLE_LOADED: 'puzzle:loaded',
  PUZZLE_SOLVED: 'puzzle:solved',
  PUZZLE_FAILED: 'puzzle:failed',
  PUZZLE_HINT: 'puzzle:hint',
  PUZZLE_RESET: 'puzzle:reset',
  
  // Analysis events
  ANALYSIS_STARTED: 'analysis:started',
  ANALYSIS_PROGRESS: 'analysis:progress',
  ANALYSIS_COMPLETE: 'analysis:complete',
  ANALYSIS_ERROR: 'analysis:error',
  
  // Engine events
  ENGINE_READY: 'engine:ready',
  ENGINE_STOPPED: 'engine:stopped',
  ENGINE_ERROR: 'engine:error',
  ENGINE_EVAL: 'engine:eval',
  
  // Board events
  BOARD_UPDATED: 'board:updated',
  MOVE_MADE: 'move:made',
  MOVE_UNDONE: 'move:undone',
  
  // Game events
  GAME_LOADED: 'game:loaded',
  GAME_OVER: 'game:over',
  
  // UI events
  THEME_CHANGED: 'ui:theme-changed',
  SETTINGS_SAVED: 'ui:settings-saved',
  MODE_CHANGED: 'ui:mode-changed',
  
  // State events
  STATE_UPDATED: 'state:updated',
  RATING_CHANGED: 'state:rating-changed',
  
  // Timer events
  TIMER_STARTED: 'timer:started',
  TIMER_STOPPED: 'timer:stopped',
  TIMER_TICK: 'timer:tick',
  TIMER_EXPIRED: 'timer:expired',
};

