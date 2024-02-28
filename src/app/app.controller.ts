import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Cookies } from 'src/common/decorators/cookies.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get()
  saveData(@Cookies() cookies: any) {
    return this.appService.getData();
  }
}
