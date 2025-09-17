import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { CurrentUser } from '../interfaces/current-user.interface';

// Es para ver quien es el usuario que esta haciendo la request

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUser => {
    // Aca tomamos la request que manda el cliente
    const request = ctx.switchToHttp().getRequest();
    
    // Sacamos la propiedad 'user'. Esta propiedad viene ya agregada por el JWTStrategy cuando valida el token.
    // Si la request no tiene un token valido, esto no anda.
    return request.user;
  },
);