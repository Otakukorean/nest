import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { UserType } from './types/userType';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('/create')
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async loginUser(
    @CurrentUser() user: UserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.login(user, res);
  }
  @Post('/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: UserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.login(user, res);
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async user(@CurrentUser() user: UserType) {
    return user;
  }
}
