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
import jwtConfig from './config/jwt.config';

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
    return await this.userService.create({ ...dto, googleId: undefined });
  }

  async validateLocalUser(email: string, password: string) {
    if (password === '')
      throw new UnauthorizedException('Please provide your password');
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

  async validateGoogleUser(payload: CreateUserDto) {
    const foundUser = await this.userService.findBy('email', payload.email);
    let user: RequestUser;
    if (!!foundUser) {
      user = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
    } else {
      const newUser = await this.userService.create(payload);
      user = { id: newUser.id, name: newUser.name, email: newUser.email };
    }

    // this object would be added to the request object
    return user;
  }

  async loginUser(user: RequestUser): Promise<Session> {
    const { accessToken, refreshToken } = await this.generateToken(user.id);
    return { user, accessToken, refreshToken } satisfies Session;
  }

  async generateToken(userId: number) {
    const payload: TAuthJWTPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, this.jwtConfiguration),
      this.jwtService.signAsync(payload, this.refreshConfiguration),
    ]);

    return { accessToken, refreshToken };
  }

  refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(
        refreshToken,
        this.refreshConfiguration,
      ) as TAuthJWTPayload;
      if (!payload) return '';
      const accessToken = this.jwtService.sign(
        { sub: payload.sub } as TAuthJWTPayload,
        this.jwtConfiguration,
      );

      return accessToken;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
}
