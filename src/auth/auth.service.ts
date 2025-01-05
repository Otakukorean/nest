import { Injectable } from '@nestjs/common';
import { Encrypt } from 'lib/encrypt/encrypt.service';
@Injectable()
export class AuthService {
  constructor(private readonly encrypt: Encrypt) {}
  async encryptText(text: string) {
    return await this.encrypt.decrypt(text);
  }
}
