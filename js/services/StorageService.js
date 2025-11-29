/**
 * Storage Service
 * Manages localStorage with error handling and validation
 */

import { StorageError, errorLogger } from '../utils/errors.js';
import { eventBus, EVENTS } from '../core/EventBus.js';

/**
 * StorageService class for managing localStorage
 */
export class StorageService {
  constructor(prefix = 'chess_app_') {
    this.prefix = prefix;
    this.cache = new Map();
  }

  /**
   * Get item from storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    const fullKey = this.prefix + key;
    
    // Check cache first
    if (this.cache.has(fullKey)) {
      return this.cache.get(fullKey);
    }

    try {
      const item = localStorage.getItem(fullKey);
      if (item === null) {
        return defaultValue;
      }
      
      const value = JSON.parse(item);
      this.cache.set(fullKey, value);
      return value;
    } catch (error) {
      errorLogger.log(new StorageError(`Failed to get ${key}`), { error });
      return defaultValue;
    }
  }

  /**
   * Set item in storage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    const fullKey = this.prefix + key;
    
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
      this.cache.set(fullKey, value);
      return true;
    } catch (error) {
      errorLogger.log(new StorageError(`Failed to set ${key}`), { error });
      
      // Check if quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.warn('[Storage] Quota exceeded, clearing old data');
        this.clearOldData();
        
        // Try again
        try {
          localStorage.setItem(fullKey, JSON.stringify(value));
          this.cache.set(fullKey, value);
          return true;
        } catch (retryError) {
          return false;
        }
      }
      
      return false;
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    const fullKey = this.prefix + key;
    
    try {
      localStorage.removeItem(fullKey);
      this.cache.delete(fullKey);
      return true;
    } catch (error) {
      errorLogger.log(new StorageError(`Failed to remove ${key}`), { error });
      return false;
    }
  }

  /**
   * Clear all items with prefix
   * @returns {boolean} Success status
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      this.cache.clear();
      return true;
    } catch (error) {
      errorLogger.log(new StorageError('Failed to clear storage'), { error });
      return false;
    }
  }

  /**
   * Get all keys with prefix
   * @returns {Array} Array of keys
   */
  keys() {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length));
    } catch (error) {
      errorLogger.log(new StorageError('Failed to get keys'), { error });
      return [];
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean} True if exists
   */
  has(key) {
    const fullKey = this.prefix + key;
    return localStorage.getItem(fullKey) !== null;
  }

  /**
   * Get storage size in bytes
   * @returns {number} Size in bytes
   */
  getSize() {
    let size = 0;
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          size += localStorage.getItem(key).length + key.length;
        }
      });
    } catch (error) {
      errorLogger.log(new StorageError('Failed to calculate size'), { error });
    }
    return size;
  }

  /**
   * Clear old data to free up space
   */
  clearOldData() {
    // Remove items with timestamps older than 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    this.keys().forEach(key => {
      const value = this.get(key);
      if (value && value.timestamp && value.timestamp < thirtyDaysAgo) {
        this.remove(key);
      }
    });
  }
}

// Global storage service instance
export const storageService = new StorageService();

