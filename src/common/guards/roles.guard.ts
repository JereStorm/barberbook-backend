import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

// La funcion de un guard es decidir si una peticion pasa o no.
// En este caso, este guard va a chequear si el usuario que hace la peticion tiene el rol necesario.

@Injectable()
export class RolesGuard implements CanActivate {
  // El 'Reflector' sirve  para leer metadatos
  constructor(private reflector: Reflector) {}

  // Este metodo es el que se va a ejecutar para chequear si el usuario puede acceder.
  canActivate(context: ExecutionContext): boolean {
    // Aca leemos los roles que estan definidos en la ruta a la que se quiere acceder.
    // Usamos el 'reflector' para buscar la 'ROLES_KEY' en el handler (el metodo del controlador) y en la clase.
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene ningun rol requerido, la peticion pasa.
    if (!requiredRoles) {
      return true;
    }

    // Aca obtenemos la peticion HTTP y nos quedamos con el 'user', que viene del guard de jwt
    const { user } = context.switchToHttp().getRequest();
    
    // Si la peticion no tiene un usuario, no puede pasar.
    if (!user) {
      return false;
    }

    // Aca chequeamos si alguno de los roles que se necesitan en la ruta coincide con el rol del usuario.
    // Si alguno coincide, el resultado es 'true' y el usuario puede seguir. Si no, devuelve 'false' y no lo deja pasar.
    return requiredRoles.some((role) => user.role === role);
  }
}