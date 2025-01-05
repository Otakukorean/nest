import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Encrypt } from 'lib/encrypt/encrypt.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './types/token.types';
import { Response } from 'express';
import { UserType } from './types/userType';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly crypto: Encrypt,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  async login(user: UserType, response: Response,redirect=false) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setTime(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const expiresRefreshToken = new Date();
    expiresRefreshToken.setTime(
      expiresRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_ACCESS_TOKEN_EXPIRATION_MS',
      )}ms`,
    });
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow(
        'JWT_REFRESH_TOKEN_EXPIRATION_MS',
      )}ms`,
    });

    await this.userService.updateUserToken({
      refreshToken: refreshToken,
      tokenExpiresAt: expiresRefreshToken,
      userId: user.id,
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresAccessToken,
    });
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expiresRefreshToken,
    });
    if(redirect){
      response.redirect('http://localhost:3000'); 

      }
    }
  async verifyUserRefreshToken(refreshToken: string, userId: string) {
    const token = await this.userService.getRefreshTokenByUser(userId);
    if (!token) {
      return new UnauthorizedException();
    }
    const authenticated = await this.crypto.decrypt(
      refreshToken,
      token.refreshToken,
    );
    if (!authenticated) {
      return new UnauthorizedException();
    }
    const user = await this.userService.getUserById(userId);
    return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }
}
