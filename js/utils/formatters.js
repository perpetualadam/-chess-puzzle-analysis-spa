/**
 * Formatting Utilities
 * Functions for formatting chess data, scores, times, etc.
 */

import { CONFIG } from '../config.js';

/**
 * Format engine score for display
 * @param {Object} score - Score object from engine
 * @returns {string} Formatted score
 */
export function formatScore(score) {
  if (!score) return '0.00';
  
  if (score.type === 'mate') {
    const mateIn = Math.abs(score.value);
    return `#${mateIn}`;
  }
  
  if (score.type === 'cp') {
    return (score.value / 100).toFixed(2);
  }
  
  return '0.00';
}

/**
 * Format time in seconds to MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format rating for display
 * @param {number} rating - Chess rating
 * @returns {string} Formatted rating
 */
export function formatRating(rating) {
  return Math.round(rating).toString();
}

/**
 * Format move in UCI notation to SAN
 * @param {string} uci - UCI move (e.g., 'e2e4')
 * @param {Chess} chess - Chess.js instance
 * @returns {string} SAN move (e.g., 'e4')
 */
export function uciToSan(uci, chess) {
  if (!uci || !chess) return '';
  
  try {
    const from = uci.substring(0, 2);
    const to = uci.substring(2, 4);
    const promotion = uci.length > 4 ? uci[4] : undefined;
    
    const move = chess.move({ from, to, promotion });
    if (!move) return uci;
    
    const san = move.san;
    chess.undo();
    return san;
  } catch (e) {
    return uci;
  }
}

/**
 * Format engine line for display
 * @param {Object} line - Engine line object
 * @param {Chess} chess - Chess.js instance
 * @returns {string} Formatted line
 */
export function formatEngineLine(line, chess = null) {
  if (!line) return '';
  
  const multipv = line.multipv || 1;
  const score = formatScore(line.score);
  const firstMove = line.pv ? line.pv.split(/\s+/)[0] : '';
  const san = chess ? uciToSan(firstMove, chess) : firstMove;
  
  return `${multipv}. ${score} ${san}`;
}

/**
 * Format multiple engine lines
 * @param {Array} lines - Array of engine lines
 * @param {Chess} chess - Chess.js instance
 * @returns {string} Formatted lines (newline separated)
 */
export function formatEngineLines(lines, chess = null) {
  if (!lines || lines.length === 0) return '';
  return lines.map(line => formatEngineLine(line, chess)).join('\n');
}

/**
 * Format puzzle themes for display
 * @param {Array} themes - Array of theme strings
 * @returns {string} Formatted themes
 */
export function formatThemes(themes) {
  if (!themes || themes.length === 0) return 'General';
  return themes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
}

/**
 * Format FEN for display (shortened)
 * @param {string} fen - FEN string
 * @returns {string} Shortened FEN
 */
export function formatFEN(fen) {
  if (!fen) return '';
  // Return only position part (before first space)
  return fen.split(' ')[0];
}

/**
 * Format move number
 * @param {number} ply - Ply number (half-moves)
 * @returns {string} Move number with color
 */
export function formatMoveNumber(ply) {
  const moveNum = Math.floor(ply / 2) + 1;
  const color = ply % 2 === 0 ? 'w' : 'b';
  return `${moveNum}${color === 'w' ? '.' : '...'}`;
}

/**
 * Format game result
 * @param {string} result - Game result (1-0, 0-1, 1/2-1/2, *)
 * @returns {string} Formatted result
 */
export function formatResult(result) {
  const resultMap = {
    '1-0': 'White wins',
    '0-1': 'Black wins',
    '1/2-1/2': 'Draw',
    '*': 'In progress'
  };
  return resultMap[result] || result;
}

/**
 * Format centipawn swing for blunder detection
 * @param {number} swing - Centipawn swing
 * @returns {string} Formatted swing
 */
export function formatSwing(swing) {
  return (swing / 100).toFixed(2);
}

/**
 * Format percentage
 * @param {number} value - Value between 0 and 1
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value) {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format large numbers with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Parse time string (MM:SS) to seconds
 * @param {string} timeStr - Time string
 * @returns {number} Seconds
 */
export function parseTime(timeStr) {
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  const mins = parseInt(parts[0], 10) || 0;
  const secs = parseInt(parts[1], 10) || 0;
  return mins * 60 + secs;
}

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength = 50) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

