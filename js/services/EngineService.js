/**
 * Engine Service
 * Manages Stockfish chess engine with performance optimizations
 */

import { eventBus, EVENTS } from '../core/EventBus.js';
import { CONFIG } from '../config.js';
import { EngineError, errorLogger, retry } from '../utils/errors.js';
import { memoize } from '../utils/performance.js';

/**
 * EngineService class for managing Stockfish
 */
export class EngineService {
  constructor(workerPath = CONFIG.ENGINE.WORKER_PATH) {
    this.workerPath = workerPath;
    this.worker = null;
    this.ready = false;
    this.listeners = new Map();
    this.evalCache = new Map();
    this.maxCacheSize = 100;
  }

  /**
   * Start the engine
   * @returns {Promise<void>}
   */
  async start() {
    if (this.worker) {
      console.warn('[Engine] Already started');
      return;
    }

    try {
      this.worker = new Worker(this.workerPath);
      this.worker.onmessage = (e) => this.handleMessage(e.data);
      this.worker.onerror = (e) => this.handleError(e);

      this.send('uci');
      this.send('isready');

      // Wait for engine to be ready
      await this.waitForReady();
      
      this.ready = true;
      eventBus.emit(EVENTS.ENGINE_READY);
      console.log('[Engine] Started successfully');
    } catch (error) {
      errorLogger.log(new EngineError('Failed to start engine'), { error });
      eventBus.emit(EVENTS.ENGINE_ERROR, error);
      throw error;
    }
  }

  /**
   * Wait for engine to be ready
   * @returns {Promise<void>}
   */
  waitForReady() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new EngineError(CONFIG.ERRORS.ENGINE_TIMEOUT));
      }, CONFIG.ENGINE.INIT_TIMEOUT);

      const handler = (msg) => {
        if (msg === 'readyok') {
          clearTimeout(timeout);
          this.off('raw', handler);
          resolve();
        }
      };

      this.on('raw', handler);
    });
  }

  /**
   * Stop the engine
   */
  stop() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.ready = false;
      this.listeners.clear();
      eventBus.emit(EVENTS.ENGINE_STOPPED);
      console.log('[Engine] Stopped');
    }
  }

  /**
   * Send command to engine
   * @param {string} cmd - UCI command
   */
  send(cmd) {
    if (this.worker) {
      this.worker.postMessage(cmd);
    }
  }

  /**
   * Handle message from engine
   * @param {string} msg - Message from engine
   */
  handleMessage(msg) {
    const msgStr = String(msg);
    
    // Emit raw message
    this.emit('raw', msgStr);

    // Parse info messages
    if (msgStr.startsWith('info')) {
      const info = this.parseInfo(msgStr);
      if (info.pv) {
        this.emit('info', info);
      }
    }

    // Parse bestmove
    if (msgStr.startsWith('bestmove')) {
      const move = msgStr.split(' ')[1];
      this.emit('bestmove', move);
    }
  }

  /**
   * Handle engine error
   * @param {Error} error - Error object
   */
  handleError(error) {
    errorLogger.log(new EngineError('Engine worker error'), { error });
    eventBus.emit(EVENTS.ENGINE_ERROR, error);
  }

  /**
   * Parse UCI info message
   * @param {string} line - Info line
   * @returns {Object} Parsed info
   */
  parseInfo(line) {
    const info = {};
    const tokens = line.split(/\s+/);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token === 'depth') info.depth = parseInt(tokens[++i], 10);
      if (token === 'seldepth') info.seldepth = parseInt(tokens[++i], 10);
      if (token === 'multipv') info.multipv = parseInt(tokens[++i], 10);
      if (token === 'nodes') info.nodes = parseInt(tokens[++i], 10);
      if (token === 'nps') info.nps = parseInt(tokens[++i], 10);
      if (token === 'time') info.time = parseInt(tokens[++i], 10);
      
      if (token === 'score') {
        const type = tokens[++i];
        const value = parseInt(tokens[++i], 10);
        info.score = { type, value };
      }
      
      if (token === 'pv') {
        info.pv = tokens.slice(i + 1).join(' ');
        break;
      }
    }

    return info;
  }

  /**
   * Subscribe to engine events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from engine events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emit engine event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        errorLogger.log(error, { context: 'EngineService.emit', event });
      }
    });
  }

  /**
   * Set engine option
   * @param {string} name - Option name
   * @param {*} value - Option value
   */
  setOption(name, value) {
    this.send(`setoption name ${name} value ${value}`);
  }

  /**
   * Set position from FEN
   * @param {string} fen - FEN string
   */
  setPosition(fen) {
    this.send(`position fen ${fen}`);
  }

  /**
   * Start search to specific depth
   * @param {number} depth - Search depth
   */
  goDepth(depth) {
    this.send(`go depth ${depth}`);
  }

  /**
   * Set MultiPV
   * @param {number} n - Number of lines
   */
  setMultiPV(n) {
    this.setOption('MultiPV', n);
  }

  /**
   * Request evaluation with caching
   * @param {string} fen - FEN string
   * @param {number} depth - Search depth
   * @param {number} multipv - Number of lines
   * @returns {Promise<Array>} Evaluation lines
   */
  async requestEval(fen, depth = CONFIG.ENGINE.DEFAULT_DEPTH, multipv = CONFIG.ENGINE.DEFAULT_MULTIPV) {
    // Check cache
    const cacheKey = `${fen}:${depth}:${multipv}`;
    if (this.evalCache.has(cacheKey)) {
      return this.evalCache.get(cacheKey);
    }

    return new Promise((resolve) => {
      const lines = [];

      const onInfo = (info) => {
        if (info.pv) {
          lines.push(info);
        }
      };

      const onBest = () => {
        this.off('info', onInfo);
        this.off('bestmove', onBest);

        const result = this.collectLines(lines, multipv);

        // Cache result
        this.cacheEval(cacheKey, result);

        resolve(result);
      };

      this.on('info', onInfo);
      this.on('bestmove', onBest);

      this.setMultiPV(multipv);
      this.setPosition(fen);
      this.goDepth(depth);
    });
  }

  /**
   * Collect and deduplicate engine lines
   * @param {Array} infos - Info objects
   * @param {number} multipv - Number of lines to return
   * @returns {Array} Collected lines
   */
  collectLines(infos, multipv) {
    const byIdx = new Map();

    for (const info of infos) {
      const idx = info.multipv || 1;
      byIdx.set(idx, info);
    }

    return Array.from(byIdx.keys())
      .sort((a, b) => a - b)
      .slice(0, multipv)
      .map(k => byIdx.get(k));
  }

  /**
   * Cache evaluation result
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   */
  cacheEval(key, value) {
    // Limit cache size
    if (this.evalCache.size >= this.maxCacheSize) {
      const firstKey = this.evalCache.keys().next().value;
      this.evalCache.delete(firstKey);
    }

    this.evalCache.set(key, value);
  }

  /**
   * Clear evaluation cache
   */
  clearCache() {
    this.evalCache.clear();
  }

  /**
   * Check if engine is ready
   * @returns {boolean} True if ready
   */
  isReady() {
    return this.ready;
  }
}

// Global engine service instance
export const engineService = new EngineService();


