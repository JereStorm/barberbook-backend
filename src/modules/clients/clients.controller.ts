import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientResponseDto } from './dto/client-response.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/interfaces/current-user.interface';

/**
 * Controlador para la gestión de clientes.
 * Provee endpoints para crear, obtener, actualizar y eliminar clientes.
 */
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  /**
     * @description Maneja la creación de un nuevo cliente.
     * @route POST /clients
     * @access Solo para usuarios con roles de SUPER_ADMIN, ADMIN o RECEPCIONISTA.
     * @param createClientDto Los datos del cliente a crear.
     * @param currentUser El usuario autenticado que realiza la solicitud.
     * @returns Retorna el cliente creado en formato ClientResponseDto.
     * @throws HttpException Lanza un error si la creación falla.
     */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async create(
    @Body() createClientDto: CreateClientDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ClientResponseDto> {
    try {
      const client = await this.clientsService.create(
        createClientDto,
        currentUser,
      );
      // Convierte el objeto del cliente a un DTO de respuesta, excluyendo propiedades no deseadas.
      return plainToClass(ClientResponseDto, client, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      // Lanza un error HTTP 400 Bad Request en caso de fallo.
      throw new HttpException(
        { message: 'Error creating client', error: error?.message || error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * @description Obtiene todos los clientes de un salón específico.
   * @route GET /clients
   * @access Solo para usuarios con roles de SUPER_ADMIN, ADMIN o RECEPCIONISTA.
   * @param currentUser El usuario autenticado, necesario para identificar el salón.
   * @returns Retorna un array de clientes en formato ClientResponseDto.
   * @throws HttpException Lanza un error si el usuario no tiene un salón asociado.
   */
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async findAll(
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ClientResponseDto[]> {
    // Valida que el usuario tenga un ID de salón para proceder con la búsqueda.
    if (!currentUser.salonId) {
      throw new HttpException(
        { message: 'Missing salonId in current user' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const clients = await this.clientsService.findAll(currentUser);

    // Convierte la lista de clientes a una lista de DTOs de respuesta.
    return plainToInstance(ClientResponseDto, clients, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * @description Actualiza un cliente por su ID.
   * @route PATCH /clients/:id
   * @access Solo para usuarios con roles de SUPER_ADMIN, ADMIN o RECEPCIONISTA.
   * @param id El ID del cliente a actualizar.
   * @param updateClientDto Los datos a modificar del cliente.
   * @param currentUser El usuario autenticado que realiza la solicitud.
   * @returns Retorna el cliente actualizado en formato ClientResponseDto.
   * @throws HttpException Lanza un error si la actualización falla.
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<ClientResponseDto> {
    try {
      const updatedClient = await this.clientsService.update(
        id,
        updateClientDto,
        currentUser,
      );

      // Convierte el objeto del cliente actualizado a un DTO de respuesta.
      return plainToInstance(ClientResponseDto, updatedClient, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      // Si el servicio ya lanzó un HttpException, se respeta su estado. De lo contrario, se usa 400 Bad Request.
      throw new HttpException(
        {
          message: 'Error updating client',
          error: error?.message || 'Unexpected error',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * @description Elimina un cliente por su ID.
   * @route DELETE /clients/:id
   * @access Solo para usuarios con roles de SUPER_ADMIN, ADMIN o RECEPCIONISTA.
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<{ message: string; id: number }> {
    try {
      await this.clientsService.remove(id, currentUser);
      return { message: 'Client deleted successfully', id };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error deleting client',
          error: error?.message || 'Unexpected error',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}