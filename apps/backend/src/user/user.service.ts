import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto.js';
import { hash } from 'argon2';
import { getUserDataSelect } from '@repo/zod-schemas/prisma-types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { password, ...rest } = dto;
    const hashedPassword = await hash(password);
    return await this.prisma.user.create({
      data: { ...rest, password: hashedPassword },
      select: getUserDataSelect(),
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
