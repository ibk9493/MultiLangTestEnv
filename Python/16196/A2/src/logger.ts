// src/logger.ts
import winston, { format, transports } from 'winston';
const { combine, timestamp, label, printf } = format;

// Custom log formatting
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', // Log only if info.level <= this level
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  transports: [
    // Write to all logs with level `info` and below to `combined.log` 
    new transports.File({ filename: 'logs/combined.log' }),
    // Write all errors to `error.log`
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // If in development, also log to console
    ...(process.env.NODE_ENV !== 'production' ? [new winston.transports.Console()] : [])
  ],
});

export default logger;