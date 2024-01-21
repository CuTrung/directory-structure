const winston = require("winston");
const WinstonGraylog2 = require("winston-graylog2");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, label, prettyPrint } = format;
require("winston-daily-rotate-file");
const os = require("os");
const { createDirectory } = require("./file.util");
var hostname = os.hostname();

const logDir = createDirectory("logs");

const configGrayLog = {
  name: "Graylog",
  level: "debug",
  silent: false,
  handleExceptions: false,
  graylog: {
    servers: [{ host: "115.78.94.109", port: 12201 }],
    hostname: hostname,
    facility: "HHMOBILE",
    bufferSize: 1400,
  },
  staticMeta: { env: "staging" },
};

const logger = createLogger({
  level: "debug",
  exitOnError: false,
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),

    printf((info) => `${info.timestamp} ${info.level}: ${info.message} \n`),
    format.errors({ stack: true }),
    format.metadata(),
    format.json(),
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: `${logDir}/errors-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
    }),
    new WinstonGraylog2(configGrayLog),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename: `${logDir}/exceptions-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
    }),
    new WinstonGraylog2(configGrayLog),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: format.combine(prettyPrint()),
    }),
  );
}

module.exports = logger;
