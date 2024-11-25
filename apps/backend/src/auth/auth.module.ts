import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import googleOauthConfig from './config/google.oauth.config';
import jwtConfig from './config/jwt.config';
import refreshConfig from './refresh.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { JWTStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    JwtService,
    LocalStrategy,
    JWTStrategy,
    GoogleStrategy,
    {
      provide: APP_GUARD, // set up for global guards
      useClass: JWTAuthGuard, // this is the guard that will be used for all routes
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
