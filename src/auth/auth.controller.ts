import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}
  @Post()
  async enText(@Body() body: { text: string }) {
    return this.authService.encryptText(body.text);
  }
}
