import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitamos validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en DTO
      forbidNonWhitelisted: true, // lanza error si mandan props extra
      transform: true, // convierte automáticamente los tipos (ej: string → number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
