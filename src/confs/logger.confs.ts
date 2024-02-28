import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { createLogger } from 'winston';
import { WinstonModule } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';
import { ConsoleType, Environments, LogLevel } from 'src/consts';
const configService = new ConfigService();
const app_name = configService.get('app_name');
const env = configService.get('node_env');
const {
  format: { combine, timestamp, printf },
  transports: { Console },
} = winston;
const {
  format: { nestLike },
} = nestWinstonModuleUtilities;

const _getCombine = (type_combine = ConsoleType.CONSOLE) => {
  const messageFormatter = {
    [ConsoleType.CONSOLE]: nestLike(app_name, {
      colors: true,
      prettyPrint: true,
    }),
    [ConsoleType.FILE]: printf(
      ({ message, timestamp, context, requestId, payload, time }) =>
        `${timestamp} - ${requestId} - ${context} - ${JSON.stringify(
          payload
        )} - ${message} - ${time}`
    ),
  };
  return combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss A',
    }),
    messageFormatter[type_combine]
  );
};

const _createDailyRotateFile = (
  type_log = LogLevel.INFO,
  options: DailyRotateFile.DailyRotateFileTransportOptions = {
    level: type_log,
    dirname: 'src/logs',
    filename: `${app_name}_${env}_%DATE%.${type_log}.log`,
    datePattern: 'YYYY_MM_DD',
    // zippedArchive: true,
    maxSize: configService.get('log_max_size'),
    maxFiles: configService.get('log_max_date'),
    format: _getCombine(ConsoleType.FILE),
  }
) => new DailyRotateFile(options);

export const LoggerCustom = WinstonModule.createLogger({
  instance: createLogger({
    transports: [
      new Console({
        format: _getCombine(),
      }),
      _createDailyRotateFile(LogLevel.INFO),
      _createDailyRotateFile(LogLevel.ERROR),
      _createDailyRotateFile(LogLevel.WARN),
    ].concat(
      env === Environments.DEVELOPMENT
        ? _createDailyRotateFile(LogLevel.DEBUG)
        : []
    ),
  }),
});
