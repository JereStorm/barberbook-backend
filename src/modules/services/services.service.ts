import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CurrentUser } from '../../common/interfaces/current-user.interface';

/**
 * Servicio para la gestión de servicios.
 * Provee métodos para crear, obtener, actualizar y eliminar servicios.
 */
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) { }

  /**
   * Crea un nuevo servicio para un salón específico.
   * @param createServiceDto Datos del servicio a crear.
   * @param currentUser El usuario autenticado que realiza la solicitud.
   * @returns El servicio creado.
   * @throws ForbiddenException si el usuario no tiene un salón asociado.
   * @throws InternalServerErrorException si ocurre un error al guardar.
   */
  async create(
    createServiceDto: CreateServiceDto,
    currentUser: CurrentUser,
  ): Promise<Service> {
    if (!currentUser.salonId) {
      throw new ForbiddenException('This user is not associated with any salon');
    }

    try {
      const newService = this.servicesRepository.create({
        ...createServiceDto,
        salonId: currentUser.salonId, // Asigna el servicio al salón del usuario
      });
      return await this.servicesRepository.save(newService);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating service: ${error?.message || error}`,
      );
    }
  }

  /**
   * Obtiene todos los servicios de un salón específico.
   * @param currentUser El usuario autenticado para determinar el salón.
   * @returns Lista de servicios.
   * @throws ForbiddenException si el usuario no tiene un salón asociado.
   */
  async findAll(currentUser: CurrentUser): Promise<Service[]> {
    if (!currentUser.salonId) {
      throw new ForbiddenException('This user is not associated with any salon');
    }

    return await this.servicesRepository.find({
      where: { salonId: currentUser.salonId },
      order: { name: 'ASC' },
    });
  }

  /**
   * Obtiene un servicio específico por su ID.
   * @param id ID del servicio.
   * @param currentUser El usuario autenticado para validar la pertenencia.
   * @returns El servicio encontrado o null si no existe.
   * @throws ForbiddenException si el usuario no tiene un salón asociado.
   * @throws NotFoundException si el servicio no es encontrado o no pertenece al salón del usuario.
   */
  async findOne(id: number, currentUser: CurrentUser): Promise<Service> {
    if (!currentUser.salonId) {
      throw new ForbiddenException('This user is not associated with any salon');
    }

    const service = await this.servicesRepository.findOne({
      where: { id, salonId: currentUser.salonId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found or does not belong to your salon`);
    }

    return service;
  }

  /**
   * Actualiza parcialmente un servicio por ID.
   * @param id ID del servicio.
   * @param updateServiceDto Datos a actualizar.
   * @param currentUser El usuario autenticado para validar la pertenencia.
   * @returns El servicio actualizado.
   * @throws ForbiddenException si el usuario no tiene un salón asociado.
   * @throws NotFoundException si el servicio no es encontrado o no pertenece al salón del usuario.
   * @throws ForbiddenException si se intenta cambiar el salonId del servicio.
   * @throws InternalServerErrorException si ocurre un error al guardar.
   */
  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    currentUser: CurrentUser,
  ): Promise<Service> {
    if (!currentUser.salonId) {
      throw new ForbiddenException('This user is not associated with any salon');
    }

    // Asegurarse de que el servicio pertenezca al salón del usuario
    const serviceToUpdate = await this.servicesRepository.findOne({
      where: { id, salonId: currentUser.salonId },
    });

    if (!serviceToUpdate) {
      throw new NotFoundException(`Service with ID ${id} not found or does not belong to your salon`);
    }

    // Proteger el campo salonId
    if (updateServiceDto.salonId && serviceToUpdate.salonId !== updateServiceDto.salonId) {
      throw new ForbiddenException('Changing salonId is not allowed');
    }

    try {
      const updatedService = await this.servicesRepository.preload({
        id,
        ...updateServiceDto,
      });

      if (!updatedService) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }

      return await this.servicesRepository.save(updatedService);
    } catch (error) {
      // Si la excepción ya es de Nest.js, la relanzamos. Si no, lanzamos una genérica.
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error updating service: ${error?.message || error}`,
      );
    }
  }

  // ---

  /**
   * Elimina un servicio por ID.
   * @param id ID del servicio a eliminar.
   * @param currentUser El usuario autenticado para validar la pertenencia.
   * @throws ForbiddenException si el usuario no tiene un salón asociado.
   * @throws NotFoundException si el servicio no es encontrado o no pertenece al salón del usuario.
   * @throws InternalServerErrorException si ocurre un error al eliminar.
   */
  async remove(id: number, currentUser: CurrentUser): Promise<void> {
    if (!currentUser.salonId) {
      throw new ForbiddenException('This user is not associated with any salon');
    }

    const serviceToRemove = await this.servicesRepository.findOne({
      where: { id, salonId: currentUser.salonId },
    });

    if (!serviceToRemove) {
      throw new NotFoundException(`Service with ID ${id} not found or does not belong to your salon`);
    }

    try {
      // TODO: Decidir si aqui se deshabilitara el servicio en lugar de eliminarlo fisicamente
      await this.servicesRepository.remove(serviceToRemove);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error removing service: ${error?.message || error}`,
      );
    }
  }
}