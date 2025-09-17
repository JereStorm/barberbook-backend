import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

// Un modulo es un contenedor que agrupa todo lo que tiene que ver con una funcionalidad.
// Aca cargamos los controladores, servicios, estrategias y otros modulos que necesitamos para la autenticacion.
@Module({
  imports: [
    // El 'UsersModule' lo importamos porque el 'AuthService' necesita usar el 'UsersService'.
    UsersModule,
    // 'PassportModule' es el modulo que integra la libreria 'Passport' para la autenticacion---->jwt.strategy.ts
    PassportModule,
    // 'JwtModule' es el modulo que maneja la creacion y validacion de tokens JWT.
    // Usamos 'registerAsync' para poder usar el 'ConfigModule' y asi obtener las variables de entorno de forma asincrona.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      // 'useFactory' es una funcion que se ejecuta para configurar el modulo.
      useFactory: async (configService: ConfigService) => ({
        // 'secret' es la clave secreta que vamos a usar para firmar los tokens. La sacamos de las variables de entorno.
        secret: configService.get<string>('JWT_SECRET'),
        // 'signOptions' son las opciones para firmar el token. Aca le decimos cuanto tiempo va a durar.
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}