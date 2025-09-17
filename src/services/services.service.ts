import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from './entities/services.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository: Repository<Services>,
  ) { }

  /**
   * Crea un nuevo service.
   * @param createServiceDto Datos del service a crear.
   * @returns Service creado.
   */
  async create(createServiceDto: CreateServiceDto): Promise<Services> {
    try {
      // Validar que venga el salonId
      if (!createServiceDto.salonId) {
        throw new BadRequestException('El campo salonId es obligatorio');
      }

      const newService = this.servicesRepository.create(createServiceDto);
      return await this.servicesRepository.save(newService);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el servicio: ${error?.message || error}`,
      );
    }
  }

  /**
   * Obtiene todos los services de un salón específico.
   * @param salonId ID del salón.
   * @returns Lista de services.
   */
  async findAll(salonId: number) {
    return await this.servicesRepository.find({
      where: { salonId },
    });
  }

  /**
     * Actualiza parcialmente un service por ID.
     * @param id ID del service.
     * @param updateServiceDto Datos a actualizar.
     * @returns Service actualizado.
     */
  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Services> {
    const service = await this.servicesRepository.preload({
      id,
      ...updateServiceDto,
    });
    if (!service) {
      throw new Error(`Service with id ${id} not found`);
    }
    return await this.servicesRepository.save(service);
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
