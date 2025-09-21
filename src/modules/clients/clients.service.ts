import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/common/interfaces/current-user.interface';

/**
 * Servicio para la gestión de clientes.
 * Provee métodos para crear, obtener, actualizar y eliminar clientes.
 */
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) { }

  /**
   * Crea un nuevo cliente.
   * Maneja errores y retorna el cliente creado.
   * @param createClientDto Datos del cliente a crear.
   * @returns Cliente creado.
   * @throws Error si ocurre un problema al crear el cliente.
   */
  async create(createClientDto: CreateClientDto, currentUser: CurrentUser): Promise<Client> {
    try {
      // TODO: SUPER_ADMIN CASE
      if (!currentUser.salonId) {
        throw new ForbiddenException('This user is not associated with any salon');
      }
      // Asegurarse de que el cliente se cree en el salón del usuario actual
      createClientDto.salonId = currentUser.salonId;
      const client = this.clientsRepository.create(createClientDto);
      return await this.clientsRepository.save(client);
    } catch (error) {
      // Se puede personalizar a conveniencia
      throw new Error(
        `Error creating client: ${error?.message || error}`,
      );
    }
  }

  /**
     * Obtiene todos los clientes de un salón específico.
     * @param salonId ID del salón.
     * @returns Lista de clientes (DTOs).
     */
  async findAll(currentUser: CurrentUser): Promise<Client[]> {
    // TODO: SUPER_ADMIN CASE
    if (!currentUser.salonId) {
      throw new ForbiddenException('El usuario no está asociado a ningún salón');
    }

    return this.clientsRepository.find({
      where: { salonId: currentUser.salonId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Actualiza parcialmente un cliente por ID.
   * @param id ID del cliente.
   * @param updateClientDto Datos a actualizar.
   * @returns Cliente actualizado.
   */
  async update(id: number, updateClientDto: UpdateClientDto, currentUser: CurrentUser): Promise<Client> {
    try {
      // TODO: SUPER_ADMIN CASE
      if (!currentUser.salonId) {
        throw new ForbiddenException('This user is not associated with any salon');
      }
      // 1- Validaciones previas a la actualización
      const clientToUpdate = await this.clientsRepository.findOne({ where: { id, salonId: currentUser.salonId } });

      // Si no se encuentra el cliente o no pertenece al mismo salón, lanzar error
      if (!clientToUpdate) {
        throw new NotFoundException(`Client with id ${id} not found`);
      }

      // Asegurarse de que el salonId no se cambie en la actualización
      if (updateClientDto.salonId && clientToUpdate.salonId !== updateClientDto.salonId) {
        throw new ForbiddenException('Changing salonId is not allowed');
      }

      // Verificar si el usuario actual tiene permiso para modificar este cliente
      if (!this.canModifyClient(currentUser, clientToUpdate)) {
        throw new ForbiddenException('You are not authorized');
      }

      // 2- Preload y guardar los cambios
      const client = await this.clientsRepository.preload({
        id,
        ...updateClientDto,
      });

      // Si por alguna razón no se pudo precargar (aunque ya se validó antes), lanzar error
      if (!client) {
        throw new Error(`Client with id ${id} not found`);
      }

      // Guardar y retornar el cliente actualizado
      return await this.clientsRepository.save(client);
    } catch (error) {
      throw new Error(`Error updating client: ${error?.message || error}`);
    }

  }

  // ************ Aun por implementar ************

  /**
   * Elimina un cliente por ID.
   * @param id ID del cliente.
   * @returns Mensaje de acción (por implementar).
   */
  remove(id: number) {
    return `This action removes a #${id} client, and yet is unimplemented`;
  }

  /**
   * Obtiene un cliente por ID.
   * @param id ID del cliente.
   * @returns Cliente encontrado (por implementar).
   */
  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  private canModifyClient(currentUser: CurrentUser, client: Client): boolean {
    // Solo se puede modificar si el cliente pertenece al mismo salón que el usuario actual
    return currentUser.salonId === client.salonId;
  }
}
