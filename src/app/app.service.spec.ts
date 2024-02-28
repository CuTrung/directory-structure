import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { UtilsService } from 'src/common/utils/utils.service';
import { UtilsModule } from 'src/common/utils/utils.module';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [UtilsModule],
      providers: [AppService, UtilsService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
