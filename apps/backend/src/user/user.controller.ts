import { JWTAuthGuard } from '@/auth/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public, Roles } from '@/auth/auth.decorators';
import { RolesAuthGuard } from '@/auth/guards/roles-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findBy('id', id);
  }

  @Roles('ADMIN')
  @UseGuards(RolesAuthGuard)
  @UseGuards(JWTAuthGuard)
  @Get('admin')
  async getAdminUsers() {
    return await this.userService.findAll();
  }
}
