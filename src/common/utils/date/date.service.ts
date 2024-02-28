import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  getCurrentDate() {
    return new Date().toLocaleTimeString('en-GB', { hour12: false });
  }
}
