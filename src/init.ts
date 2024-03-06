import { INestApplication, VersioningType } from '@nestjs/common';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { AuthGuard } from './common/guards/auth.guard';
import { HttpHeaders } from './consts';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DefaultParamsMiddleware } from './common/middlewares/default-params.middleware';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './confs/swagger.confs';
import { helmetMiddleware } from './confs/middlewares.confs';
import { FormatResponseInterceptor } from './common/interceptors/format-response.interceptor';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ApiService } from './common/utils/api/api.service';
import { HttpAdapterHost } from '@nestjs/core';

export const initApp = async (app: INestApplication) => {
  const { white_list, server_prefix, version_latest } = app
    .get(ConfigService)
    .get('env');
  app.setGlobalPrefix(server_prefix);
  app.use(DefaultParamsMiddleware);
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: HttpHeaders.VERSION,
    defaultVersion: version_latest,
  });
  app.use(helmetMiddleware, compression(), cookieParser());
  app.enableCors({
    origin: white_list,
  });
  app.useGlobalGuards(new AuthGuard());
  app.useGlobalPipes(new ValidationPipe());
  const apiService = app.get(ApiService);
  app.useGlobalInterceptors(
    new FormatResponseInterceptor(apiService),
    new LoggingInterceptor(apiService)
  );
  app.useGlobalFilters(
    new AllExceptionFilter(app.get(HttpAdapterHost), apiService)
  );
  app = initSwagger(app);
  return app;
};
