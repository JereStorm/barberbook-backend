import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clients } from './entities/clients.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

/**
 * Servicio para la gestión de clientes.
 * Provee métodos para crear, obtener, actualizar y eliminar clientes.
 */
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientsRepository: Repository<Clients>,
  ) { }

  /**
   * Crea un nuevo cliente.
   * Maneja errores y retorna el cliente creado.
   * @param createClientDto Datos del cliente a crear.
   * @returns Cliente creado.
   * @throws Error si ocurre un problema al crear el cliente.
   */
  async create(createClientDto: CreateClientDto): Promise<Clients> {
    try {
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
   * @returns Lista de clientes.
   */
  async findAll(salonId: number): Promise<Clients[]> {
    return await this.clientsRepository.find({
      where: { salonId },
    });
  }

  /**
   * Actualiza parcialmente un cliente por ID.
   * @param id ID del cliente.
   * @param updateClientDto Datos a actualizar.
   * @returns Cliente actualizado.
   */
  async update(id: number, updateClientDto: UpdateClientDto): Promise<Clients> {
    const client = await this.clientsRepository.preload({
      id,
      ...updateClientDto,
    });
    if (!client) {
      throw new Error(`Client with id ${id} not found`);
    }
    return await this.clientsRepository.save(client);
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
}
