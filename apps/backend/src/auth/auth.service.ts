import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(dto: CreateUserDto) {
    console.log('Registering user...');
    const user = await this.userService.findByEmail(dto.email);
    if (!!user) throw new ConflictException('User already exists');
    return await this.userService.create(dto);
  }
}
