const objectHelper = require('../helpers/object.helper');
const appRoot = require('app-root-path');
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, prettyPrint } = format;
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const logDir = path.normalize(`${appRoot}/storage/logs`);

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true }, err => {
        console.log(err)
    });
}

const logger = createLogger({
    level: 'debug',
    exitOnError: false,
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        printf((info) => {
            let errorJson = objectHelper.stringifyError(info);
            return `${info.timestamp} ${info.level}: ${info.message} \n\tStack: ${errorJson}`;
        }),
    ),
    transports: [
        new transports.DailyRotateFile({
            filename: `${logDir}/errors-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            format: format.combine(
                // Render in one line in your log file.
                // If you use prettyPrint() here it will be really
                // difficult to exploit your logs files afterwards.
                format.json()
            ),
            level: 'error'
        }),
        new transports.DailyRotateFile({
            filename: `${logDir}/combined-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            format: format.combine(
                // Render in one line in your log file.
                // If you use prettyPrint() here it will be really
                // difficult to exploit your logs files afterwards.
                format.json()
            )
        }),
    ],
    exceptionHandlers: [
        new transports.DailyRotateFile({
            filename: `${logDir}/exceptions-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: format.combine(prettyPrint()),
    }));
}

module.exports = logger;
