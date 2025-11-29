import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';

import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/interfaces/current-user.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * Controlador para la gestión de servicios.
 * Provee endpoints para crear, obtener, actualizar y eliminar servicios de un salón.
 */
@Controller('services')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  /**
   * @description Maneja la creación de un nuevo servicio.
   * @route POST /services
   * @access Solo para usuarios con roles de SUPER_ADMIN, ADMIN o RECEPCIONISTA.
   * @param createServiceDto Los datos del servicio a crear.
   * @param currentUser El usuario autenticado que realiza la solicitud.
   * @returns Retorna el servicio creado en formato ServiceResponseDto.
   * @throws HttpException Lanza un error si la creación falla.
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ServiceResponseDto> {
    try {
      const service = await this.servicesService.create(createServiceDto, currentUser);
      return plainToClass(ServiceResponseDto, service, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Error creating service', error: error?.message || error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * @description Obtiene todos los servicios de un salón específico.
   * @route GET /services
   * @access Solo para usuarios con roles de SUPER_ADMIN, ADMIN, RECEPCIONISTA o ESTILISTA.
   * @param currentUser El usuario autenticado, necesario para identificar el salón.
   * @returns Retorna un array de servicios en formato ServiceResponseDto.
   * @throws HttpException Lanza un error si el usuario no tiene un salón asociado.
   */
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.ESTILISTA)
  async findAll(
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ServiceResponseDto[]> {
    if (!currentUser.salonId) {
      throw new HttpException(
        { message: 'Missing salonId in current user' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const services = await this.servicesService.findAll(currentUser);
    return plainToInstance(ServiceResponseDto, services, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * @description Obtiene un servicio por su ID.
   * @route GET /services/:id
   * @access Solo para usuarios con roles de SUPER_ADMIN, ADMIN, RECEPCIONISTA o ESTILISTA.
   * @param id El ID del servicio a obtener.
   * @param currentUser El usuario autenticado, necesario para la validación.
   * @returns Retorna el servicio encontrado en formato ServiceResponseDto.
   * @throws HttpException Lanza un error si el servicio no es encontrado o no pertenece al salón del usuario.
   */
  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.ESTILISTA)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ServiceResponseDto> {
    const service = await this.servicesService.findOne(id, currentUser);
    if (!service) {
      throw new HttpException('Service not found', HttpStatus.NOT_FOUND);
    }
    return plainToClass(ServiceResponseDto, service, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * @description Actualiza parcialmente un servicio por su ID.
   * @route PATCH /services/:id
   * @access Solo para usuarios con roles de SUPER_ADMIN, ADMIN o RECEPCIONISTA.
   * @param id El ID del servicio a actualizar.
   * @param updateServiceDto Los datos a modificar del servicio.
   * @param currentUser El usuario autenticado que realiza la solicitud.
   * @returns Retorna el servicio actualizado en formato ServiceResponseDto.
   * @throws HttpException Lanza un error si la actualización falla.
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ServiceResponseDto> {
    try {
      const updatedService = await this.servicesService.update(
        id,
        updateServiceDto,
        currentUser,
      );
      return plainToInstance(ServiceResponseDto, updatedService, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error updating service',
          error: error?.message || 'Unexpected error',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * @description Elimina un servicio por su ID.
   * @route DELETE /services/:id
   * @access Solo para usuarios con roles de SUPER_ADMIN, ADMIN o RECEPCIONISTA.
   * @param id El ID del servicio a eliminar.
   * @param currentUser El usuario autenticado que realiza la solicitud.
   * @returns Retorna un objeto con un mensaje de éxito.
   * @throws HttpException Lanza un error si la eliminación falla.
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<{ message: string }> {
    try {
      await this.servicesService.remove(id, currentUser);
      return { message: 'Service removed successfully' };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error removing service' + error.message,
          error: error?.message || 'Unexpected error',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}