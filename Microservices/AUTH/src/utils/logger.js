// src/utils/logger.js
const fs = require("fs");
const path = require("path");
const util = require("util");
const winston = require("winston");

const COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  debug: "\x1b[36m",
  info: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};

const LOG_LEVELS = ["error", "warn", "info", "debug"];
const level = (process.env.LOG_LEVEL || "info").toLowerCase();
const logLevel = LOG_LEVELS.includes(level) ? level : "info";

const logsDir = path.resolve(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString().split("T")[1].split("Z")[0];

const stringifyData = (data) => {
  if (data === undefined || data === null) {
    return "";
  }

  if (data instanceof Error) {
    return util.inspect(
      {
        name: data.name,
        message: data.message,
        stack: data.stack,
      },
      { depth: 5, breakLength: Infinity },
    );
  }

  try {
    return JSON.stringify(data);
  } catch {
    return util.inspect(data, { depth: 5, breakLength: Infinity });
  }
};

const formatLine = ({ timestamp, level: entryLevel, message, data }, useColors = false) => {
  const color = useColors ? COLORS[entryLevel] || COLORS.reset : "";
  const dim = useColors ? COLORS.dim : "";
  const reset = useColors ? COLORS.reset : "";
  const levelLabel = entryLevel.toUpperCase().padEnd(5);
  const payload = data === undefined || data === null ? "" : ` ${dim}${stringifyData(data)}${reset}`;

  return `${dim}[${timestamp}]${reset} ${color}${levelLabel}${reset} ${message}${payload}`;
};

const buildTransportFormat = (useColors = false) =>
  winston.format.printf((info) =>
    formatLine(
      {
        timestamp: info.timestamp || getTimestamp(),
        level: info.level,
        message: info.message,
        data: info.data,
      },
      useColors,
    ),
  );

const logger = winston.createLogger({
  level: logLevel,
  levels: winston.config.npm.levels,
  format: winston.format.combine(winston.format.timestamp({ format: getTimestamp })),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(buildTransportFormat(true)),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "auth.log"),
      format: winston.format.combine(buildTransportFormat(false)),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "auth.error.log"),
      level: "error",
      format: winston.format.combine(buildTransportFormat(false)),
    }),
  ],
  exitOnError: false,
});

const log = (entryLevel, message, data) => {
  logger.log({
    level: entryLevel,
    message,
    data,
  });
};

module.exports = {
  debug: (message, data = null) => log("debug", message, data),
  info: (message, data = null) => log("info", message, data),
  warn: (message, data = null) => log("warn", message, data),
  error: (message, data = null) => log("error", message, data),
};
