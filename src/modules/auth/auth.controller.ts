import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/interfaces/current-user.interface';

// Maneja las peticiones que llegan a la api

@Controller('auth')
export class AuthController {

  // Aca inyectamos el servicio 'AuthService'. El servicio es el que tiene la logica,
  // y el controlador lo usa para resolver las peticiones.
  constructor(private readonly authService: AuthService) {}

  // Este metodo maneja las peticiones post que llegan a '/auth/login'.
  // El decorador '@HttpCode' detecta si todo esta bien, de ser asi, la respuesta va a ser un 200.
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    // '@Body' le indica a nest que agarre el 'body' de la peticion y lo use para crear una instancia de 'LoginDto'.
    return await this.authService.login(loginDto);
  }

  // Este metodo maneja las peticiones get que van a '/auth/profile'.
  // '@UseGuards' se encarga de usar el 'JwtAuthGuard' para chequear que el usuario este logueado y tenga un token valido.
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@GetCurrentUser() currentUser: CurrentUser) {
    // '@GetCurrentUser' es el decorador que creamos. Lo usamos para obtener la informacion del usuario que esta 
    // logueado de una forma mas limpia y sin tener que acceder directamente a la peticion.
    return {
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        salonId: currentUser.salonId,
        isActive: currentUser.isActive,
      },
    };
  }

  // Este metodo maneja la peticion de logout.
  // Como estamos usando jwt, la sesion no se guarda en el servidor.
  // El 'logout' es algo simbolico, aca solo mandamos un mensaje de exito.
  // La accion real de cerrar sesion (eliminar el token) se hace en el frontend.
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Logout exitoso' };
  }
}

  // Esto se puede prestar a confusion, pero no esta mal; jwt es stateless, entonces no tenes registro
  // de las sesiones en el servidor. Cuando un usuario se logea, solamente se crea un token que se pasa al cliente
  // cada peticion valida el token--->cerrar la sesion, implica perder los accesos que teniamos en esa sesion
  // si se limpia el token, ya esta.