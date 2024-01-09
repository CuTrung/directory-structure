import helmet from 'helmet';
import * as compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { mergedBodyMiddleware } from './middlewares/merged-body/merged-body.middleware';
import { CheckPermissionMiddleware } from './middlewares/check-permission/check-permission.middleware';
import { ErrorsFilter } from './filters/errors/errors.filter';
import { envStringToArray } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: envStringToArray(process.env.WHITELIST),
    },
  });
  app.setGlobalPrefix('api');
  app.use(compression());
  app.use(helmet());
  app.useGlobalFilters(new ErrorsFilter());

  app.use(mergedBodyMiddleware, new CheckPermissionMiddleware().use);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
