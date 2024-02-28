import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
@Injectable()
export class StringService {
  toArray(str: string, split_with: string | RegExp = ',') {
    return str.split(split_with);
  }

  genRandom(length: number = 6): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
}
