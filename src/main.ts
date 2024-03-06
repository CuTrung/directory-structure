import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { initApp } from './init';
import { LoggerCustom } from './confs/logger.confs';

async function bootstrap() {
  let app = await NestFactory.create(AppModule, {
    logger: LoggerCustom,
  });
  const { port, url, node_env } = app.get(ConfigService).get('env');
  app = await initApp(app);
  await app.listen(port);
  Logger.log(`🚀 Application is running on: ${url} (${node_env})`);
}

bootstrap();
