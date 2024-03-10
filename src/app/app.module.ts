import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvs, validationSchema } from 'src/confs/env.confs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UtilsModule } from 'src/common/utils/utils.module';
import { UtilsService } from 'src/common/utils/utils.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
      load: [getEnvs],
      validationSchema,
    }),
    // ThrottlerModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => [
    //     {
    //       ttl: config.get('throttle_ttl'),
    //       limit: config.get('throttle_limit'),
    //     },
    //   ],
    // }),
    UtilsModule,
    UserModule,
    // new MongoModule().register({
    //   maxPoolSize: 20,
    // }),
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    AppService,
    UtilsService,
  ],
  exports: [UtilsModule],
})
export class AppModule {}
