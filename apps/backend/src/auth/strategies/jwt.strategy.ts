import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { TAuthJWTPayload } from '@/lib/types';
import { AuthService } from '../auth.service';
import { Session } from '@repo/shared-types';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const authorization = req?.headers?.['x-app-session'];
          if (!authorization) return null;
          const session = JSON.parse(authorization) as Session;
          return session.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret,
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
