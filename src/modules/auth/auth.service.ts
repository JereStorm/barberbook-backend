import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { LoginDto, AuthResponseDto, JwtPayload } from './dto/auth.dto';

// Este servicio se encarga de la logica de login y la validacion de usuarios.
@Injectable()
export class AuthService {
  // Aca inyectamos otros servicios que vamos a necesitar, como el 'UsersService' para interactuar con la base de datos
  // y el 'JwtService' para generar y firmar tokens.
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // El metodo 'login' es el que el controlador va a llamar cuando alguien intente loguearse.
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // 1. Chequeamos si el usuario existe en la base de datos.
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Si existe, nos fijamos si su cuenta esta activa.
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // 3. Verificamos la contrasena. Usamos 'bcrypt.compare' para comparar la contrasena que nos mando el usuario con el hash que tenemos guardado en la base de datos.
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 4. Si todo lo anterior esta bien, generamos el token JWT.
    // Creamos el 'payload' con la informacion basica del usuario que queremos guardar en el token.
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      salonId: user.salonId,
    };

    // Usamos el 'jwtService' para firmar el token.
    const access_token = this.jwtService.sign(payload);

    // 5. Por ultimo, preparamos la respuesta que le vamos a mandar al cliente.
    // Incluimos el 'access_token' y la informacion del usuario.
    const response: AuthResponseDto = {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        salonId: user.salonId,
        // Con esto nos fijamos si el usuario tiene un salon y, si lo tiene, le agregamos la informacion del salon a la respuesta.
        ...(user.salon && {
          salon: {
            id: user.salon.id,
            name: user.salon.name,
          },
        }),
      },
    };

    return response;
  }

  // Este metodo lo tenemos para que la estrategia de Passport lo use. 
  // No se usa directamente en el controlador, pero se necesita para que 'Passport' pueda validar al usuario.
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    // Si encontramos el usuario y la contrasena es correcta, devolvemos los datos del usuario.
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    
    return null;
  }
}


// Esto tambien se puede prestar a confusion, jwt.strategy, y auth.service no hacen lo mismo

// El auth.service, es el responsable de la validacion inicial del usuario y la generacion del token,
// es decir, se encarga del "login" en si.
// Por otro lado, el jwt.strategy es el que usa ese token en cada pedido siguiente para verificar
// que el usuario que lo presenta sea valido.