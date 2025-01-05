import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'nestjs-prisma';
import { Encrypt } from 'lib/encrypt/encrypt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, Encrypt],
})
export class AuthModule {}
