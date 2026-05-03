// src/utils/logger.js
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Log levels
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info'];

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().split('T')[1].split('Z')[0]; // HH:mm:ss.SSS
};

const formatLog = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const colorCode = {
    debug: COLORS.cyan,
    info: COLORS.green,
    warn: COLORS.yellow,
    error: COLORS.red,
  }[level];

  const levelLabel = level.toUpperCase().padEnd(5);
  let output = `${COLORS.dim}[${timestamp}]${COLORS.reset} ${colorCode}${levelLabel}${COLORS.reset} ${message}`;

  if (data) {
    output += ` ${COLORS.dim}${JSON.stringify(data)}${COLORS.reset}`;
  }

  return output;
};

const logger = {
  debug: (message, data = null) => {
    if (LOG_LEVELS.debug >= currentLevel) {
      console.log(formatLog('debug', message, data));
    }
  },

  info: (message, data = null) => {
    if (LOG_LEVELS.info >= currentLevel) {
      console.log(formatLog('info', message, data));
    }
  },

  warn: (message, data = null) => {
    if (LOG_LEVELS.warn >= currentLevel) {
      console.warn(formatLog('warn', message, data));
    }
  },

  error: (message, data = null) => {
    if (LOG_LEVELS.error >= currentLevel) {
      console.error(formatLog('error', message, data));
    }
  },
};

module.exports = logger;
