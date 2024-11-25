import { AuthService } from '@/auth/auth.service';
import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Session } from '@repo/shared-types';
import { Request } from 'express';
import { IS_PUBLIC } from '../auth.decorators';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    super();
  }

  // bypass the JWT Guard for public routes
  // this is because I used the global authentication system
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  // this function is called when the JWT Guard errors out.
  // @ts-ignore
  async handleRequest(err: any, user: any, info: any, ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (err || !user) {
      // if the JWT guard error is "TokenExpiredError", it means the access token has expired.
      // so we need to refresh the access token and set it in the request headers.
      if (info?.name === 'TokenExpiredError') {
        const session = request?.headers?.['x-app-session'] as string;
        const parsedSession: Session | null = !!session
          ? JSON.parse(session)
          : null;

        if (!parsedSession.refreshToken)
          throw new UnauthorizedException('Authentication failed');

        try {
          const newAccessToken = await this.authService.refreshAccessToken(
            parsedSession.user.id,
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
