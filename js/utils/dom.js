/**
 * DOM Utilities
 * Efficient DOM manipulation and query helpers
 */

import { createDOMCache } from './performance.js';

// Create global DOM cache
const domCache = createDOMCache();

/**
 * Efficient query selector (cached)
 * @param {string} selector - CSS selector
 * @returns {Element|null} DOM element
 */
export function $(selector) {
  return domCache.query(selector);
}

/**
 * Query all elements (cached)
 * @param {string} selector - CSS selector
 * @returns {NodeList} DOM elements
 */
export function $$(selector) {
  return domCache.queryAll(selector);
}

/**
 * Clear DOM cache
 */
export function clearDOMCache() {
  domCache.clear();
}

/**
 * Invalidate specific selector in cache
 * @param {string} selector - CSS selector
 */
export function invalidateCache(selector) {
  domCache.invalidate(selector);
}

/**
 * Add event listener with automatic cleanup
 * @param {Element} element - DOM element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {Function} Cleanup function
 */
export function addListener(element, event, handler, options = {}) {
  if (!element) return () => {};
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/**
 * Add multiple event listeners with cleanup
 * @param {Element} element - DOM element
 * @param {Object} events - Object mapping event names to handlers
 * @returns {Function} Cleanup function
 */
export function addListeners(element, events) {
  const cleanups = Object.entries(events).map(([event, handler]) =>
    addListener(element, event, handler)
  );
  return () => cleanups.forEach(cleanup => cleanup());
}

/**
 * Set multiple attributes at once
 * @param {Element} element - DOM element
 * @param {Object} attrs - Attributes object
 */
export function setAttributes(element, attrs) {
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      element.setAttribute(key, value);
    }
  });
}

/**
 * Create element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Attributes object
 * @param {Array|string} children - Child elements or text
 * @returns {Element} Created element
 */
export function createElement(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Add children
  const childArray = Array.isArray(children) ? children : [children];
  childArray.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Element) {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Toggle class on element
 * @param {Element} element - DOM element
 * @param {string} className - Class name
 * @param {boolean} force - Force add/remove
 */
export function toggleClass(element, className, force) {
  if (!element) return;
  element.classList.toggle(className, force);
}

/**
 * Show/hide element
 * @param {Element} element - DOM element
 * @param {boolean} show - Show or hide
 */
export function toggleVisibility(element, show) {
  if (!element) return;
  element.hidden = !show;
}

/**
 * Empty element (remove all children)
 * @param {Element} element - DOM element
 */
export function empty(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Get element dimensions
 * @param {Element} element - DOM element
 * @returns {Object} Width and height
 */
export function getDimensions(element) {
  if (!element) return { width: 0, height: 0 };
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom
  };
}

/**
 * Check if element is visible in viewport
 * @param {Element} element - DOM element
 * @returns {boolean} True if visible
 */
export function isInViewport(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

