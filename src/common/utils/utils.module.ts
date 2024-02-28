import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { StringModule } from './string/string.module';
import { StringService } from './string/string.service';
import { DateModule } from './date/date.module';
import { DateService } from './date/date.service';
import { ApiModule } from './api/api.module';
import { ApiService } from './api/api.service';

@Module({
  imports: [StringModule, DateModule, ApiModule],
  providers: [UtilsService, StringService, DateService, ApiService],
  exports: [UtilsService, StringService, DateService, ApiService],
})
export class UtilsModule {}
