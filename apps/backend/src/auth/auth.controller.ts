import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/user/dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestUser } from '@repo/shared-types';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refreshUserToken(@Request() req: { user: RequestUser }) {
    return await this.authService.refreshUserToken(req.user);
  }

  @Post('register')
  async registerUser(@Body() dto: CreateUserDto) {
    return await this.authService.registerUser(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Request() req: { user: RequestUser }) {
    return await this.authService.loginUser(req.user);
  }
}
