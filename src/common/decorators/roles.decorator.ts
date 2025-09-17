import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';

// Sirve para asignarle roles a un endpoint, entonces, si se usa
// por ejemplo en un controlador, le pasamos los roles que tienen permiso para acceder.
// Luego, el "RolesGuard" va a leer esta informacion para decidir si el usuario puede acceder o no.**/

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);