// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configurado para desarrollo
  app.enableCors({
    origin: 'http://localhost:3000', // URL del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Barberbook API')
    .setDescription('Documentación de la API de Barberbook')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description:
          'Ingrese su token JWT en el siguiente formato: Bearer <token>',
        in: 'header',
      },
      'access-token', // Nombre del esquema para Swagger
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('/docs', app, document);

  await app.listen(3001);
  console.log('🚀 Servidor corriendo en http://localhost:3001');
}
bootstrap();
