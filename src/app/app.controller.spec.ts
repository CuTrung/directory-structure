import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilsService } from 'src/common/utils/utils.service';
import { UtilsModule } from 'src/common/utils/utils.module';
describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [UtilsModule],
      controllers: [AppController],
      providers: [AppService, UtilsService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
