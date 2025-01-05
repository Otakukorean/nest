/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as cryptojs from 'crypto-js';
@Injectable()
export class Encrypt {
  async encrypt(text: string) {
    const enText = cryptojs.AES.encrypt(
      text,
      process.env.ENCRYPTION_KEY as string,
    ).toString();
    return enText;
  };
  async decrypt(text: string) {
    const decText = cryptojs.AES.decrypt(
      text,
      process.env.ENCRYPTION_KEY as string,
    ).toString();
    return decText;
  };
};
