import { AuthService } from '@/auth/auth.service';
import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Session } from '@repo/shared-types';
import { Request } from 'express';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  // this function is called when the JWT Guard errors out.
  handleRequest(err: any, user: any, info: any, ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (err || !user) {
      // if the JWT guard error is "TokenExpiredError", it means the access token has expired.
      // so we need to refresh the access token and set it in the request headers.
      if (info?.name === 'TokenExpiredError') {
        const session = request?.headers?.['x-app-session'] as string;
        const parsedSession = !!session ? JSON.parse(session) : null;

        if (!parsedSession.refreshToken)
          throw new UnauthorizedException('Authentication failed');

        try {
          const newAccessToken = this.authService.refreshAccessToken(
            parsedSession.refreshToken,
          );

          if (!newAccessToken)
            throw new InternalServerErrorException('Something went wrong');

          const newSession = {
            ...parsedSession,
            accessToken: newAccessToken,
          };

          request.headers['x-app-session'] = JSON.stringify(newSession);
          console.log('Successfully refreshed...');

          // we call this method to recall/retry the JWT Guard
          return super.canActivate(ctx);
        } catch (error) {
          console.log({ error });
          throw new UnauthorizedException('Authentication failed');
        }
      }

      throw new UnauthorizedException('Authentication Failed');
    }

    return user;
  }
}
