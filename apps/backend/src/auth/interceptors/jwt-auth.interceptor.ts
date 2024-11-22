import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JWTAuthInterceptor implements NestInterceptor {
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap(() => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const response = ctx.switchToHttp().getResponse<Response>();

        const session = request?.headers?.['x-app-session'] as string;

        response.setHeader('x-app-session', session || '');
      }),
    );
  }
}
