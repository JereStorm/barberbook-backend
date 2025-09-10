import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

/**
 * Controlador para la gestión de clientes.
 * Provee endpoints para crear, obtener, actualizar y eliminar clientes.
 */
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }

  /**
   * Crea un nuevo cliente.
   * @param createClientDto Datos del cliente a crear.
   * @returns Cliente creado.
   * @route POST /clients
   */
  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    try {
      const client = await this.clientsService.create(createClientDto);
      return {
        message: 'Client created successfully',
        data: client,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error creating client',
          error: error?.message || error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Obtiene todos los clientes de un salón específico.
   * @param salonId ID del salón (query param).
   * @returns Lista de clientes.
   * @route GET /clients?salonId=1
   */
  @Get()
  async findAll(@Query('salonId') salonId: string) {
    if (!salonId) {
      throw new HttpException(
        { message: 'Missing salonId query parameter' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const clients = await this.clientsService.findAll(Number(salonId));
    return {
      message: 'Clients fetched successfully',
      data: clients,
    };
  }

  /**
   * Actualiza parcialmente un cliente por ID.
   * @param id ID del cliente (path param).
   * @param updateClientDto Datos a actualizar.
   * @returns Cliente actualizado.
   * @route PATCH /clients/:id
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    try {
      const updatedClient = await this.clientsService.update(+id, updateClientDto);
      return {
        message: 'Client updated successfully',
        data: updatedClient,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Error updating client',
          error: error?.message || error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ************ Aun por implimentar ************

  /**
   * Elimina un cliente por ID.
   * @param id ID del cliente (path param).
   * @returns Mensaje de acción.
   * @route DELETE /clients/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }

  /**
   * Obtiene un cliente por ID.
   * @param id ID del cliente (path param).
   * @returns Cliente encontrado.
   * @route GET /clients/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }
}
