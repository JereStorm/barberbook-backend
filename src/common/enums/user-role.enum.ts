// Roles de usuario que vamos a usar en la aplicacion.
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  RECEPCIONISTA = 'recepcionista',
  ESTILISTA = 'estilista',
}

// Aca armamos un objeto que nos ayuda a definir que rol puede crear a que otro.
// Es una jerarquia de permisos. Por ejemplo, un 'admin' puede crear 'recepcionistas' y 'estilistas',
// pero un 'recepcionista' solo puede crear 'estilistas'.------>Jerarquia cascada.
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  [UserRole.SUPER_ADMIN]: [UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.ESTILISTA],
  [UserRole.ADMIN]: [UserRole.RECEPCIONISTA, UserRole.ESTILISTA],
  [UserRole.RECEPCIONISTA]: [UserRole.ESTILISTA],
  [UserRole.ESTILISTA]: [],
};

// Nos sirve para chequear si un usuario con un 'rol' puede crear a otro con un 'rol' especifico.
// Recibe el rol de quien crea y el rol del que se quiere crear.
export function canCreateRole(creatorRole: UserRole, targetRole: UserRole): boolean {
  // El 'super_admin' puede crear todos los otros roles.
  if (creatorRole === UserRole.SUPER_ADMIN) {
    return true; 
  }

  // Si no es 'super_admin', buscamos en la jerarquia si el rol de quien crea tiene permiso para crear el rol que se le pasa.
  const allowedRoles = ROLE_HIERARCHY[creatorRole];
  
  // Aca usamos el metodo 'includes' para ver si el rol que se quiere crear esta en la lista de los permitidos.
  return allowedRoles.includes(targetRole);
}