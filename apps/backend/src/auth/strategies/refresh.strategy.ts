import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwtConfig from '../jwt.config';
import { type ConfigType } from '@nestjs/config';
import { TAuthJWTPayload } from '@/lib/types';
import { AuthService } from '../auth.service';
import refreshConfig from '../refresh.config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    refreshConfiguration: ConfigType<typeof refreshConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  // it gets the "accessToken" from the header request and decodes it
  // if the jwt is valid, it calls this function
  // the payload is the decoded jwt
  // the return value would be appended to the request object as req.user
  async validate(payload: TAuthJWTPayload) {
    const userId = payload.sub;
    return await this.authService.validateRefreshJWTUser(userId);
  }
}
