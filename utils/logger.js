const winston = require('winston');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const logDir = path.dirname(config.paths.logs);
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'restaurant-pos' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({ 
            filename: config.paths.logs,
            level: 'error',
            handleExceptions: true
        }),
        // If we're in development, log to the console with the format:
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ],
    exitOnError: false
});

logger.throwError = (message, error) => {
    logger.error(message, error);
    throw new Error(message);
};

module.exports = logger;