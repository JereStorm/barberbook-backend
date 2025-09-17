import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';


// Con los decoradores de 'class-validator' y 'class-transformer', 
// podemos validar los datos y transformarlos.

export class LoginDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  password: string;
}

// Este dto define la estructura que va a tener la respuesta cuando un usuario se loguea.

export class AuthResponseDto {
  // El 'access_token' es el jwt que le vamos a dar al usuario.
  access_token: string;
  
  // Y aca mandamos un objeto con la informacion del usuario,
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    salonId: number | null;
    salon?: {
      id: number;
      name: string;
    };
  };
}

// El payload es el contenido que va a ir adentro del token.
// Aca guardamos informacion basica del usuario, como el ID y el rol, para poder usarla despues en las peticiones.

export class JwtPayload {

  // 'sub' es el estandar para el ID de usuario en un token.

  sub: number; // user id
  
  email: string;
  role: UserRole;
  salonId: number | null;
  
  // 'iat' (issued at) y 'exp' (expiration time) son estandares del JWT
  // que nos dicen cuando se creo el token y cuando se vence.
  
  iat?: number;
  exp?: number;
}