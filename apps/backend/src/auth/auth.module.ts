import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './jwt.config';
import refreshConfig from './refresh.config';
import { JWTStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    JwtService,
    LocalStrategy,
    JWTStrategy,
    RefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
