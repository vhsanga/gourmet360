import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionsFilter } from './utils/filters/exceptions.filter';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en DTOs
      forbidNonWhitelisted: true, // lanza error si hay propiedades extra
      transform: true, // convierte tipos automáticamente
    }),
  );
   app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,         // ponlo true solo si vas a usar cookies
    maxAge: 86400,              // cache del preflight OPTIONS
  });

  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
