/**
 * Performance Utilities
 * Debouncing, throttling, memoization, and other performance optimizations
 */

/**
 * Debounce function - delays execution until after wait time has elapsed since last call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, wait = 100) {
  let inThrottle;
  let lastResult;
  return function executedFunction(...args) {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
    return lastResult;
  };
}

/**
 * Memoize function - caches results of expensive function calls
 * @param {Function} func - Function to memoize
 * @param {Function} resolver - Optional function to generate cache key
 * @returns {Function} Memoized function
 */
export function memoize(func, resolver) {
  const cache = new Map();
  return function memoized(...args) {
    const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Request animation frame wrapper for smooth animations
 * @param {Function} callback - Function to call on next frame
 * @returns {number} Request ID
 */
export function nextFrame(callback) {
  return requestAnimationFrame(callback);
}

/**
 * Batch DOM updates to minimize reflows
 * @param {Function[]} updates - Array of update functions
 */
export function batchDOMUpdates(updates) {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

/**
 * Lazy load function - delays execution until needed
 * @param {Function} loader - Function that returns a promise
 * @returns {Function} Lazy loader function
 */
export function lazy(loader) {
  let promise;
  return () => {
    if (!promise) {
      promise = loader();
    }
    return promise;
  };
}

/**
 * Create a cached DOM query selector
 * @returns {Object} DOM cache with query methods
 */
export function createDOMCache() {
  const cache = new Map();
  
  return {
    /**
     * Query selector with caching
     * @param {string} selector - CSS selector
     * @returns {Element|null} DOM element
     */
    query(selector) {
      if (!cache.has(selector)) {
        cache.set(selector, document.querySelector(selector));
      }
      return cache.get(selector);
    },
    
    /**
     * Query all with caching
     * @param {string} selector - CSS selector
     * @returns {NodeList} DOM elements
     */
    queryAll(selector) {
      if (!cache.has(selector)) {
        cache.set(selector, document.querySelectorAll(selector));
      }
      return cache.get(selector);
    },
    
    /**
     * Clear cache
     */
    clear() {
      cache.clear();
    },
    
    /**
     * Remove specific selector from cache
     * @param {string} selector - CSS selector
     */
    invalidate(selector) {
      cache.delete(selector);
    }
  };
}

/**
 * Measure function execution time
 * @param {Function} func - Function to measure
 * @param {string} label - Label for console output
 * @returns {Function} Wrapped function
 */
export function measurePerformance(func, label) {
  return function measured(...args) {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();
    console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

/**
 * Create a simple object pool for reusing objects
 * @param {Function} factory - Function to create new objects
 * @param {number} initialSize - Initial pool size
 * @returns {Object} Pool with acquire/release methods
 */
export function createPool(factory, initialSize = 10) {
  const pool = [];
  
  // Pre-populate pool
  for (let i = 0; i < initialSize; i++) {
    pool.push(factory());
  }
  
  return {
    acquire() {
      return pool.length > 0 ? pool.pop() : factory();
    },
    release(obj) {
      pool.push(obj);
    },
    size() {
      return pool.length;
    }
  };
}

