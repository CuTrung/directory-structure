import { Injectable } from '@nestjs/common';
import { UtilsService } from 'src/common/utils/utils.service';

@Injectable()
export class AppService {
  constructor(private utilsService: UtilsService) {}
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
