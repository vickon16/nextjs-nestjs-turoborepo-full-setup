import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
