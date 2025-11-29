/**
 * Error Handling Utilities
 * Standardized error handling and logging
 */

import { CONFIG } from '../config.js';

/**
 * Custom error classes
 */
export class ChessAppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'ChessAppError';
    this.code = code;
    this.timestamp = new Date();
  }
}

export class EngineError extends ChessAppError {
  constructor(message) {
    super(message, 'ENGINE_ERROR');
    this.name = 'EngineError';
  }
}

export class StorageError extends ChessAppError {
  constructor(message) {
    super(message, 'STORAGE_ERROR');
    this.name = 'StorageError';
  }
}

export class ValidationError extends ChessAppError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NetworkError extends ChessAppError {
  constructor(message) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * Error logger
 */
class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
  }

  /**
   * Log error
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  log(error, context = {}) {
    const errorEntry = {
      message: error.message,
      name: error.name,
      code: error.code || 'UNKNOWN',
      stack: error.stack,
      context,
      timestamp: new Date()
    };

    this.errors.push(errorEntry);

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Error]', errorEntry);
    }
  }

  /**
   * Get all logged errors
   * @returns {Array} Error entries
   */
  getErrors() {
    return [...this.errors];
  }

  /**
   * Clear error log
   */
  clear() {
    this.errors = [];
  }

  /**
   * Export errors as JSON
   * @returns {string} JSON string
   */
  export() {
    return JSON.stringify(this.errors, null, 2);
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger();

/**
 * Safe function wrapper - catches and logs errors
 * @param {Function} fn - Function to wrap
 * @param {Object} options - Options
 * @returns {Function} Wrapped function
 */
export function safe(fn, options = {}) {
  const { fallback = null, onError = null, context = {} } = options;

  return function safeFn(...args) {
    try {
      const result = fn.apply(this, args);
      
      // Handle promises
      if (result && typeof result.then === 'function') {
        return result.catch(error => {
          errorLogger.log(error, { ...context, args });
          if (onError) onError(error);
          return fallback;
        });
      }
      
      return result;
    } catch (error) {
      errorLogger.log(error, { ...context, args });
      if (onError) onError(error);
      return fallback;
    }
  };
}

/**
 * Validate FEN string
 * @param {string} fen - FEN string
 * @throws {ValidationError} If FEN is invalid
 */
export function validateFEN(fen) {
  if (!fen || typeof fen !== 'string') {
    throw new ValidationError('FEN must be a non-empty string');
  }

  const parts = fen.split(' ');
  if (parts.length < 4) {
    throw new ValidationError('Invalid FEN format');
  }

  // Basic validation of position part
  const position = parts[0];
  const ranks = position.split('/');
  if (ranks.length !== 8) {
    throw new ValidationError('FEN must have 8 ranks');
  }

  return true;
}

/**
 * Validate PGN string
 * @param {string} pgn - PGN string
 * @throws {ValidationError} If PGN is invalid
 */
export function validatePGN(pgn) {
  if (!pgn || typeof pgn !== 'string') {
    throw new ValidationError('PGN must be a non-empty string');
  }

  // Basic validation - should contain at least one move
  if (!pgn.match(/[1-9]\./)) {
    throw new ValidationError('PGN must contain at least one move');
  }

  return true;
}

/**
 * Handle async errors with retry logic
 * @param {Function} fn - Async function
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries (ms)
 * @returns {Promise} Result or error
 */
export async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

