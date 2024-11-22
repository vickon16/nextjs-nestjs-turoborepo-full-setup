import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { getUserDataSelect, TGetUserDataSelect } from '@repo/shared-types';
import { hash } from 'argon2';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { password, googleId, ...rest } = dto;
    const hashedPassword = await hash(password);
    return await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
        ...(googleId && { googleId }),
      },
      select: getUserDataSelect(),
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: getUserDataSelect(),
    });
  }

  async findBy(type: 'id' | 'email', value: any, withPassword?: boolean) {
    let user: TGetUserDataSelect | null = null;
    switch (type) {
      case 'id': {
        user = await this.prisma.user.findUnique({
          where: { id: value },
          select: getUserDataSelect(undefined, withPassword),
        });
        break;
      }
      case 'email': {
        user = await this.prisma.user.findUnique({
          where: { email: value },
          select: getUserDataSelect(undefined, withPassword),
        });
        break;
      }
      default: {
        user = null;
      }
    }

    return user;
  }
}
