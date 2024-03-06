import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema, User } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/common/db/nosql/mongo/mongo.module';
import { MongoService } from 'src/common/db/nosql/mongo/mongo.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongoModule,
  ],
  controllers: [UserController],
  providers: [UserService, MongoService],
})
export class UserModule {}
