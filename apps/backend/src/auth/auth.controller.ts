import { CreateUserDto } from '@/user/dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RequestUser } from '@repo/shared-types';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() dto: CreateUserDto, @Res() res: Response) {
    const newUser = await this.authService.registerUser(dto);
    return await this.authService.loginUser(newUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Req() req: { user: RequestUser }) {
    return await this.authService.loginUser(req.user);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('callback/google')
  async googleCallback(
    @Req() req: { user: RequestUser },
    @Res() res: Response,
  ) {
    const session = await this.authService.loginUser(req.user);
    res.redirect(
      `${process.env.ClIENT_URL}/api/google?accessToken=${session.accessToken}&refreshToken=${session.refreshToken}&userId=${req.user.id}&name=${req.user.name}&email=${req.user.email}`,
    );
  }
}
