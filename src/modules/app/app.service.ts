import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AppService {
  constructor(private readonly authService: AuthService) {}
  getHello(): string {
    return 'Hello World!';
  }

  getFromAuth(): string {
    return this.authService.findAll();
  }
}
