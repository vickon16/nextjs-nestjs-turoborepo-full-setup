import { RequestUser, Session } from '@repo/shared-types';
import { CreateUserDto } from '@/user/dto';
import { UserService } from '@/user/user.service';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
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
      role: user.role,
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
      role: user.role,
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
      role: user.role,
    } satisfies RequestUser;
  }

  async validateGoogleUser(payload: CreateUserDto) {
    const foundUser = await this.userService.findBy('email', payload.email);
    let user: RequestUser;
    if (!!foundUser) {
      user = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
    } else {
      const newUser = await this.userService.create(payload);
      user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
    }

    // this object would be added to the request object
    return user;
  }

  async loginUser(user: RequestUser): Promise<Session> {
    const { accessToken, refreshToken } = await this.generateToken(user.id);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(
      user.id,
      hashedRefreshToken,
    );
    return { user, accessToken, refreshToken } satisfies Session;
  }

  async logoutUser(userId: number) {
    const user = await this.userService.findBy('id', userId);
    if (!user) throw new UnauthorizedException('User not found');
    await this.userService.updateHashedRefreshToken(userId, null);
    return null;
  }

  async generateToken(userId: number) {
    const payload: TAuthJWTPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, this.jwtConfiguration),
      this.jwtService.signAsync(payload, this.refreshConfiguration),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(userId, refreshToken: string) {
    const user = await this.userService.findBy('id', userId);
    if (!user) throw new UnauthorizedException('User not found');

    const refreshTokenMatched = await verify(
      user?.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid refresh token');

    try {
      const payload = (await this.jwtService.verifyAsync(
        refreshToken,
        this.refreshConfiguration,
      )) as TAuthJWTPayload;
      if (!payload) return '';
      const accessToken = await this.jwtService.signAsync(
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
