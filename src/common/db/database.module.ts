import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export abstract class DatabaseModule {
  abstract register(options?: {}): DynamicModule;
}
