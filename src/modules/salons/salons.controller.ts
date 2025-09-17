import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { SalonsService } from './salons.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import type { CurrentUser } from '../../common/interfaces/current-user.interface';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';


@Controller('salons')
// Con '@UseGuards' le decimos a nest que todas las rutas de este controlador van a pasar por estos dos guards.
// Primero se va a chequear el 'JwtAuthGuard' para validar el token y despues el 'RolesGuard' para ver los permisos.
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  // Aca manejamos la creacion de salones.
  @Post()
  // Con '@Roles' le decimos al 'RolesGuard' que solo los 'super_admin' pueden crear salones.
  @Roles(UserRole.SUPER_ADMIN)
  async create(
    @Body() createSalonDto: CreateSalonDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    const salon = await this.salonsService.create(createSalonDto, currentUser);
    return {
      message: 'Salón creado correctamente',
      salon: {
        id: salon.id,
        name: salon.name,
        address: salon.address,
        mobile: salon.mobile,
        createdAt: salon.createdAt,
        // Con esto le agregamos a la respuesta la cantidad de usuarios del salon--->es lo que mostramos despues en el dashboard
        usersCount: salon.users?.length || 0,
      },
    };
  }

  // Aca manejamos la obtencion de todos los salones.
  @Get()
  // Solo los 'super_admin' pueden ver todos los salones.
  @Roles(UserRole.SUPER_ADMIN)
  async findAll(@GetCurrentUser() currentUser: CurrentUser) {
    const salons = await this.salonsService.findAll(currentUser);
    // Mapeamos el resultado para devolver solo la informacion que nos interesa del salon.
    return salons.map(salon => ({
      id: salon.id,
      name: salon.name,
      address: salon.address,
      mobile: salon.mobile,
      createdAt: salon.createdAt,
      usersCount: salon.users?.length || 0,
      // Aca contamos solo los usuarios que estan activos.
      activeUsersCount: salon.users?.filter(user => user.isActive).length || 0,
    }));
  }

  // Aca se obtiene el salon al que pertenece el usuario logueado.
  // Despues de las pruebas hay que activar los roles.
  @Get('my-salon')
  // @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.ESTILISTA)
  async getMyCurrentSalon(@GetCurrentUser() currentUser: CurrentUser) {
    const salon = await this.salonsService.getCurrentUserSalon(currentUser);
    
    // Si el usuario no tiene salon, devolvemos 'null'.
    if (!salon) {
      return null;
    }

    // Devolvemos la informacion del salon al que pertenece el usuario.
    return {
      id: salon.id,
      name: salon.name,
      address: salon.address,
      mobile: salon.mobile,
      createdAt: salon.createdAt,
      usersCount: salon.users?.length || 0,
      activeUsersCount: salon.users?.filter(user => user.isActive).length || 0,
    };
  }

  // Manejamos la obtencion de un salon por su ID.
  @Get(':id')
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findOne(
    // Con 'ParseIntPipe' nos aseguramos que el parametro 'id' sea un numero.
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    const salon = await this.salonsService.findOne(id, currentUser);
    // Devolvemos la informacion del salon y la lista de usuarios que tiene.
    return {
      id: salon.id,
      name: salon.name,
      address: salon.address,
      mobile: salon.mobile,
      createdAt: salon.createdAt,
      users: salon.users?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })) || [],
    };
  }

  // Manejamos la actualizacion de un salon.
  @Patch(':id')
  // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalonDto: UpdateSalonDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    const salon = await this.salonsService.update(id, updateSalonDto, currentUser);
    return {
      message: 'Salón actualizado correctamente',
      salon: {
        id: salon.id,
        name: salon.name,
        address: salon.address,
        mobile: salon.mobile,
        createdAt: salon.createdAt,
      },
    };
  }

  // Manejamos la eliminacion de un salon.
  @Delete(':id')
  // @Roles(UserRole.SUPER_ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    await this.salonsService.remove(id, currentUser);
    return { message: 'Salón eliminado correctamente' };
  }
}