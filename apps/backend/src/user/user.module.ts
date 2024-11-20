import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from '@/user/user.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
