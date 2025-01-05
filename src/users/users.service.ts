import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Encrypt } from 'lib/encrypt/encrypt.service';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { LoginUserDto } from 'src/auth/dto/LoginUser.dto';
import { UserChecking } from 'src/auth/helpers/userChecking.service';
import { RefreshToken } from './types/refreshToken.types';
import * as uuid from 'uuid';
@Injectable()
export class UsersService {
  constructor(
    private readonly crypto: Encrypt,
    private readonly prisma: PrismaService,
    private readonly userHeapler: UserChecking,
  ) {}
  async createUser(body: CreateUserDto) {
    const ifExist = await this.userHeapler.getUserByEmail(body.email);
    if (ifExist) {
      return new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'User With This Email is Already exist!',
      }).getResponse();
    }
    const encryptPawssword = await this.crypto.encrypt(body.password);
    await this.prisma.user.create({
      data: {
        email: body.email,
        name: body.username,
        password: encryptPawssword,
        userAgent: 'LOCAL',
        image: body.image,
      },
    });
    return new HttpException('User Created Successfuly!', HttpStatus.CREATED);
  }
  async verifyUser(body: LoginUserDto) {
    const user = await this.userHeapler.getUserByEmail(body.email);
    if (!user) {
      return new NotFoundException('User With This Email Dosenot Exist!');
    }
    const comparePasswords = await this.crypto.decrypt(
      body.password,
      user.password,
    );
    if (!comparePasswords) {
      return new BadRequestException('Something bad happened', {
        cause: new Error(),
        description: 'Email or password Dose not Match!',
      }).getResponse();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, updatedAt, ...newUser } = user;
    return newUser;
  }
  async getUserById(userId: string) {
    return this.userHeapler.getUserById(userId);
  }
  async updateUserToken(token: RefreshToken) {
    await this.prisma.tokens.deleteMany({
      where: {
        userId: token.userId,
      },
    });
    const { refreshToken, tokenExpiresAt, userId } = token;
    const encryptToken = await this.crypto.encrypt(refreshToken);
    const id = uuid.v4();
    await this.prisma.tokens.create({
      data: {
        refreshToken: encryptToken,
        userId: userId,
        refreshTokenExpiresAt: tokenExpiresAt,
        id,
      },
    });
  }
  async getRefreshTokenByUser(userId: string) {
    const refreshToken = await this.prisma.tokens.findFirst({
      where: {
        userId,
      },
    });
    return refreshToken;
  }
}
