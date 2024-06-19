import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = {
    allowedHeaders: ['content-type'],
    origin: 'http://localhost:3000',
    credentials: true,
  };

  app.enableCors(config);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(5000);
}
bootstrap();
