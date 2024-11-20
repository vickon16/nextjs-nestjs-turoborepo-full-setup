import { RequestUser, Session } from '@repo/shared-types';
import { CreateUserDto } from '@/user/dto';
import { UserService } from '@/user/user.service';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'argon2';
import { TAuthJWTPayload } from '@/lib/types';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './refresh.config';
import { type ConfigType } from '@nestjs/config';
import jwtConfig from './jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshConfiguration: ConfigType<typeof refreshConfig>,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async registerUser(dto: CreateUserDto) {
    const user = await this.userService.findBy('email', dto.email);
    if (!!user) throw new ConflictException('User already exists');
    const newUser = await this.userService.create(dto);
    return await this.loginUser(newUser);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findBy('email', email, true);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordMatch = await verify(user.password, password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid Credentials');

    // this object would be added to the request object
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    } satisfies RequestUser;
  }

  async validateJWTUser(userId: number) {
    const user = await this.userService.findBy('id', userId);
    if (!user) throw new UnauthorizedException('User not found');

    // this object would be added to the request object
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    } satisfies RequestUser;
  }

  async validateRefreshJWTUser(userId: number) {
    const user = await this.userService.findBy('id', userId);
    if (!user) throw new UnauthorizedException('User not found');

    // this object would be added to the request object
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    } satisfies RequestUser;
  }

  async loginUser(user: RequestUser) {
    const { accessToken, refreshToken } = await this.generateToken(user.id);
    return { user, accessToken, refreshToken } satisfies Session;
  }

  async refreshUserToken(user: RequestUser) {
    const { accessToken, refreshToken } = await this.generateToken(user.id);
    return { user, accessToken, refreshToken } satisfies Session;
  }

  private async generateToken(userId: number) {
    const payload: TAuthJWTPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, this.jwtConfiguration),
      this.jwtService.signAsync(payload, this.refreshConfiguration),
    ]);

    return { accessToken, refreshToken };
  }
}
