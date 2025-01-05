import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserChecking } from 'src/auth/helpers/userChecking.service';
import { Encrypt } from 'lib/encrypt/encrypt.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserChecking, Encrypt, PrismaService],
})
export class UsersModule {}
