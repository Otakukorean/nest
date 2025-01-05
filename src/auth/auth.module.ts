import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'nestjs-prisma';
import { Encrypt } from 'lib/encrypt/encrypt.service';
import { UserChecking } from './helpers/userChecking.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    Encrypt,
    UserChecking,
    LocalStrategy,
    ConfigService,
    JwtStrategy,
    UsersService,
    JwtRefreshStrategy,
    GoogleStrategy
  ],
})
export class AuthModule {}
