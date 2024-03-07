import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { MongoService } from 'src/common/db/nosql/mongo/mongo.service';
import { Model } from 'mongoose';
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        MongoService,
        {
          provide: getModelToken(User.name),
          useValue: {}, // Add any necessary mock or fake implementation here
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
