import { Test, TestingModule } from '@nestjs/testing';
import { StringService } from './string.service';

describe('StringService', () => {
  let service: StringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StringService],
    }).compile();

    service = module.get<StringService>(StringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
