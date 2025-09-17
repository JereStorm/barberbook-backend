import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';

// Entities
import { User } from './modules/users/entities/user.entity';
import { Salon } from './modules/salons/entities/salon.entity';

// Modules
import { UsersModule } from './modules/users/users.module';
import { SalonsModule } from './modules/salons/salons.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Salon],
        synchronize: false, 
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    
    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    SalonsModule,
  ],
  providers: [
    // Interceptor global para serialización de DTOs
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}