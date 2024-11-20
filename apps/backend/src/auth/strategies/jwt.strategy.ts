import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwtConfig from '../jwt.config';
import { type ConfigType } from '@nestjs/config';
import { TAuthJWTPayload } from '@/lib/types';
import { AuthService } from '../auth.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  // it gets the "accessToken" from the header request and decodes it
  // if the jwt is valid, it calls this function
  // the payload is the decoded jwt
  // the return value would be appended to the request object as req.user
  async validate(payload: TAuthJWTPayload) {
    const userId = payload.sub;
    return await this.authService.validateJWTUser(userId);
  }
}
