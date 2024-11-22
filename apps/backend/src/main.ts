import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { JWTAuthInterceptor } from '@/auth/interceptors/jwt-auth.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new JWTAuthInterceptor());
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'x-app-session',
      'Access-Control-Allow-Credentials',
      'X-Requested-With',
    ],
    exposedHeaders: ['x-app-session'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
