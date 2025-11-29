/**
 * State Management
 * Centralized state management with observer pattern
 */

import { eventBus, EVENTS } from './EventBus.js';
import { CONFIG, getDefaultSettings } from '../config.js';
import { StorageError, errorLogger } from '../utils/errors.js';

/**
 * StateManager class for centralized state management
 */
export class StateManager {
  constructor(storageKey = CONFIG.STORAGE_KEY) {
    this.storageKey = storageKey;
    this.state = this.loadState();
    this.observers = new Map();
  }

  /**
   * Load state from localStorage
   * @returns {Object} State object
   */
  loadState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      errorLogger.log(new StorageError('Failed to load state'), { error });
    }
    
    return this.getDefaultState();
  }

  /**
   * Get default state
   * @returns {Object} Default state object
   */
  getDefaultState() {
    return {
      settings: getDefaultSettings(),
      puzzle: {
        rating: CONFIG.PUZZLE.DEFAULT_RATING,
        streak: 0,
        level: CONFIG.PUZZLE.DEFAULT_LEVEL,
        history: []
      },
      stats: {
        totalSolved: 0,
        totalAttempts: 0,
        rushHighScore: 0,
        battleWins: 0,
        battleLosses: 0
      },
      preferences: {
        lastMode: 'puzzle',
        favoriteGames: []
      }
    };
  }

  /**
   * Get current state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Get specific state path
   * @param {string} path - Dot-notation path (e.g., 'settings.depth')
   * @returns {*} Value at path
   */
  get(path) {
    const keys = path.split('.');
    let value = this.state;
    
    for (const key of keys) {
      if (value === undefined || value === null) return undefined;
      value = value[key];
    }
    
    return value;
  }

  /**
   * Set specific state path
   * @param {string} path - Dot-notation path
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = this.state;
    
    for (const key of keys) {
      if (!(key in target)) {
        target[key] = {};
      }
      target = target[key];
    }
    
    target[lastKey] = value;
    this.saveState();
    this.notifyObservers(path, value);
    eventBus.emit(EVENTS.STATE_UPDATED, { path, value });
  }

  /**
   * Update state with partial object
   * @param {Object} updates - Updates object
   */
  update(updates) {
    this.state = { ...this.state, ...updates };
    this.saveState();
    this.notifyObservers('*', this.state);
    eventBus.emit(EVENTS.STATE_UPDATED, { updates });
  }

  /**
   * Update nested state
   * @param {Function} updater - Function that receives state and modifies it
   */
  updateWith(updater) {
    updater(this.state);
    this.saveState();
    this.notifyObservers('*', this.state);
    eventBus.emit(EVENTS.STATE_UPDATED, { state: this.state });
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      errorLogger.log(new StorageError('Failed to save state'), { error });
      throw new StorageError('Failed to save state');
    }
  }

  /**
   * Reset state to defaults
   */
  reset() {
    this.state = this.getDefaultState();
    this.saveState();
    this.notifyObservers('*', this.state);
    eventBus.emit(EVENTS.STATE_UPDATED, { reset: true });
  }

  /**
   * Subscribe to state changes
   * @param {string} path - Path to observe ('*' for all changes)
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  observe(path, callback) {
    if (!this.observers.has(path)) {
      this.observers.set(path, []);
    }
    
    this.observers.get(path).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.observers.get(path);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify observers of state change
   * @param {string} path - Changed path
   * @param {*} value - New value
   */
  notifyObservers(path, value) {
    // Notify specific path observers
    if (this.observers.has(path)) {
      this.observers.get(path).forEach(callback => {
        try {
          callback(value, path);
        } catch (error) {
          errorLogger.log(error, { context: 'StateManager.notifyObservers', path });
        }
      });
    }
    
    // Notify wildcard observers
    if (path !== '*' && this.observers.has('*')) {
      this.observers.get('*').forEach(callback => {
        try {
          callback(this.state, path);
        } catch (error) {
          errorLogger.log(error, { context: 'StateManager.notifyObservers', path: '*' });
        }
      });
    }
  }
}

// Global state manager instance
export const stateManager = new StateManager();

