import { Injectable } from '@nestjs/common';
import { Encrypt } from 'lib/encrypt/encrypt.service';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserChecking {
  constructor(
    private readonly crypto: Encrypt,
    private readonly prisma: PrismaService,
  ) {}
  async getUserByEmail(email: string) {
    const exist = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!exist) {
      return null;
    }
    return exist;
  }
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, updatedAt, createdAt, ...newUser } = user;
    return newUser;
  }
}
