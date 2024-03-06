import { HttpStatus } from '@nestjs/common';

export class ApiResponse {
  status_code?: HttpStatus;
  timestamp?: string;
  path: string;
  errors?: [] | null;
  data: any;
}
