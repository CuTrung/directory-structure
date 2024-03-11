import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        useGlobalPrefix: true,
        typePaths: ['./**/*.graphql'],
        playground: true, // create client to test query with graphql
        formatError: (formattedError) => ({
          message: formattedError.message,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
