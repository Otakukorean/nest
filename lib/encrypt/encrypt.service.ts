/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class Encrypt {
  async encrypt(text: string) {
    const enText =bcrypt.hashSync(
      text,
      15
    ).toString();
    return enText;
  };
  async decrypt(plainText: string,cipherText:string) {
    const decText =bcrypt.compareSync(plainText,cipherText)
    return decText;
  };
};
