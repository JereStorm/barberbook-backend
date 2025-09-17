import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../dto/auth.dto';
import type { CurrentUser } from '../../../common/interfaces/current-user.interface';

// Esta clase es la estrategia de validacion del JWT. 
// Basicamente, se encarga de recibir un token, lo decodifica y chequea si es valido o no.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // En el constructor le pasamos el 'UsersService' para buscar al usuario y 'ConfigService' para acceder a las variables de entorno.
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    // Aca configuramos la estrategia.
    super({
      // Le decimos de donde tiene que sacar el token. En este caso, del 'header' de la peticion.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 'ignoreExpiration' en 'false' hace que el token expire. Si se vence, lo va a rechazar.
      ignoreExpiration: false,
      // 'secretOrKey' es la clave secreta que se usa para firmar el token---->borrar defaultsecret despues de las pruebas.
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  // El metodo validate agarra el "payload" del token y lo valida.
  // Si todo esta bien, devuelve el objeto 'user' para que podamos usarlo en la app.
  async validate(payload: JwtPayload): Promise<CurrentUser> {
    // Primero, buscamos al usuario en la base de datos usando el 'email' que viene en el token.
    const user = await this.usersService.findByEmail(payload.email);

    // Si no encontramos al usuario, o si no esta activo---->esto es por el estado del usuario activado/desactivado
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // Si pasa, devolvemos un objeto con la informacion que vamos a necesitar del usuario.
    // Esto es lo que despues usamos con el decorador '@GetCurrentUser'----->current-user.decorator
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      salonId: user.salonId,
      isActive: user.isActive,
    };
  }
}