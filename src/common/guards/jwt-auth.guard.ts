import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Este guard se encarga de validar el token jwt.
// Cuando lo usemos, se va a ejecutar la estrategia de JWT que definimos-->jwt.strategy

@Injectable()

export class JwtAuthGuard extends AuthGuard('jwt') {

  // Este metodo se usa para saber si la peticion puede seguir.
  // Aca le decimos que use la logica que ya viene en el authguard para chequear si el token es valido.
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}