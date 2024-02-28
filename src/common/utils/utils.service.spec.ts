import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';
import { StringService } from './string/string.service';
import { DateService } from './date/date.service';
import { UtilsModule } from './utils.module';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UtilsModule],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
