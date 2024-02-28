import { Injectable } from '@nestjs/common';
import { StringService } from './string/string.service';
import { DateService } from './date/date.service';
import { ApiService } from './api/api.service';

@Injectable()
export class UtilsService {
  constructor(
    private stringService: StringService,
    private dateService: DateService,
    private apiService: ApiService
  ) {}

  getStringService() {
    return this.stringService;
  }

  getDateService() {
    return this.dateService;
  }

  getApiService() {
    return this.apiService;
  }
}
