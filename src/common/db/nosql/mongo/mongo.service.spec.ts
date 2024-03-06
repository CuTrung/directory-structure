import { Test, TestingModule } from '@nestjs/testing';
import { MongoService } from './mongo.service';

describe('MongoService', () => {
  let service: MongoService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoService],
    }).compile();

    service = module.get<MongoService<any>>(MongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
