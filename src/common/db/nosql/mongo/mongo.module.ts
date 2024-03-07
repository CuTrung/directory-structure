import { DynamicModule, Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { DatabaseModule } from '../../database.module';
import { ConfigService } from '@nestjs/config';
import MongooseAutoPopulate from 'mongoose-autopopulate';
import MongooseTimestamp from 'mongoose-timestamp';
import { Connection } from 'mongoose';
@Module({
  providers: [MongoService],
})
export class MongoModule extends DatabaseModule {
  applyPlugin(connection: Connection) {
    connection.plugin(MongooseAutoPopulate);
    connection.plugin(MongooseTimestamp, {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
    return connection;
  }
  register(options?: MongooseModuleOptions): DynamicModule {
    return {
      module: MongoModule,
      imports: [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            uri: `mongodb://${configService.get(
              'MONGO_HOST'
            )}:${configService.get('MONGO_PORT')}`,
            connectionFactory: this.applyPlugin,
            auth: {
              username: configService.get('MONGO_USER'),
              password: configService.get('MONGO_PASSWORD'),
            },
            dbName: configService.get('MONGO_DB_NAME'),
            ...options,
          }),
        }),
      ],
    };
  }
}
