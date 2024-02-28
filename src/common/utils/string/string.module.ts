import { Module } from '@nestjs/common';
import { StringService } from './string.service';

@Module({
  providers: [StringService],
})
export class StringModule {}
