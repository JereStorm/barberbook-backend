import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Between, In, LessThan, MoreThan, Repository } from 'typeorm'; // <--- Importar 'In'
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CurrentUser } from 'src/common/interfaces/current-user.interface';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    
    // Inyectamos el repositorio de Servicios directamente para buscar por lista de IDs
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  // --- FIND ALL BY EMPLOYEE ---
  async findAllByEmployee(employeeId: number): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.find({
      where: { employeeId },
      // Revisar esto, cambie "service" por "services"------>muchos servicios
      relations: ['client', 'services', 'salon', 'employee'], 
      order: { startTime: 'ASC' },
    });

    if (!appointments) {
      throw new NotFoundException(
        `Appointments of user with id ${employeeId} not found`,
      );
    }
    return appointments;
  }

  // --- CREATE ---
  async create(
    dto: CreateAppointmentDto,
    currentUser: CurrentUser,
  ): Promise<Appointment> {
    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser.role !== UserRole.RECEPCIONISTA
    ) {
      throw new ForbiddenException('No tiene permisos para crear un turno');
    }

    // Buscar TODOS los servicios seleccionados por sus IDs
    // Usamos el operador In([]) para buscar varios a la vez
    const services = await this.servicesRepository.findBy({
      id: In(dto.serviceIds),
    });

    // Validar si se encontraron todos
    if (!services || services.length === 0) {
      throw new NotFoundException('No se encontraron los servicios seleccionados');
    }

    // Validar que los servicios pertenezcan al mismo salon
    const invalidService = services.find(s => s.salonId !== dto.salonId);
    if (invalidService) {
        throw new ForbiddenException(`El servicio ${invalidService.name} no pertenece a este salón`);
    }

    // Crear la instancia del turno
    const appointment = this.appointmentsRepository.create(dto);

    // Calcular Duración Total y Precio Total
    // Usamos reduce para sumar
    const totalDurationMin = services.reduce((sum, s) => sum + s.durationMin, 0);
    const totalPrice = services.reduce((sum, s) => sum + Number(s.price), 0);

    // Setear datos calculados
    appointment.duration = totalDurationMin;
    appointment.totalPrice = totalPrice;
    appointment.services = services; // Asignamos la relación ManyToMany

    // Calcular hora de fin
    const startTime = new Date(dto.startTime);
    const finishTime = new Date(startTime.getTime() + totalDurationMin * 60000);
    appointment.finishTime = finishTime;

    // Validar Disponibilidad
    if (dto.employeeId) {
      // Pasamos el finishTime calculado para validar
      if (await this.checkDisponibility(dto.employeeId, startTime, finishTime)) {
        throw new ForbiddenException(
          'El empleado no está disponible en este horario',
        );
      }
    }

    return await this.appointmentsRepository.save(appointment);
  }

  // --- FIND ALL ---
  async findAll(currentUser: CurrentUser): Promise<Appointment[]> {
    if (currentUser.salonId == null) {
      throw new ForbiddenException('El usuario no tiene salon asignado');
    }

    const data = await this.appointmentsRepository.find({
      // service--->services
      relations: ['client', 'employee', 'services'],
      where: { salonId: currentUser.salonId },
      order: { startTime: 'ASC' },
    });

    return data;
  }

  // --- FIND ONE ---
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      // service--->services
      relations: ['client', 'employee', 'services', 'salon'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
    return appointment;
  }

  // --- UPDATE ---
  async update(
    id: number,
    dto: UpdateAppointmentDto,
    currentUser: CurrentUser,
  ): Promise<Appointment> {
    if (!currentUser.salonId) {
      throw new ForbiddenException('This user is not associated with any salon');
    }

    // Buscamos el turno actual, incluyendo sus servicios actuales
    const appointment = await this.appointmentsRepository.findOne({
      where: { id, salonId: currentUser.salonId },
      relations: ['services']
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Preparar objeto de actualización
    // Utilizo Object.assign para mezclar lo que ya tenía con lo nuevo del DTO
    const updatedData: any = { ...dto };

    // Si cambiaron los servicios O la hora de inicio
    const hasServiceChange = dto.serviceIds && dto.serviceIds.length > 0;
    const hasTimeChange = !!dto.startTime;

    if (hasServiceChange || hasTimeChange) {
      
      let servicesToUse = appointment.services;

      // Si enviaron nuevos servicios, buscarlos
      if (hasServiceChange) {
         servicesToUse = await this.servicesRepository.findBy({
            id: In(dto.serviceIds!),
         });
         updatedData.services = servicesToUse;
      }

      // Recalcular totales
      const totalDurationMin = servicesToUse.reduce((sum, s) => sum + s.durationMin, 0);
      const totalPrice = servicesToUse.reduce((sum, s) => sum + Number(s.price), 0);
      
      updatedData.duration = totalDurationMin;
      updatedData.totalPrice = totalPrice;

      // Recalcular hora fin
      const startTime = new Date(dto.startTime || appointment.startTime);
      const finishTime = new Date(startTime.getTime() + totalDurationMin * 60000);
      
      updatedData.startTime = startTime; // Asegurar formato Date
      updatedData.finishTime = finishTime;

      // Validar disponibilidad si cambiaron horas o servicios
      // (Si no enviaron employeeId, usamos el que ya tenía el turno)
      const employeeIdToCheck = dto.employeeId || appointment.employeeId;
      if (employeeIdToCheck) {
         // Solo validamos si realmente cambió algo de tiempo o el empleado
         const isSameTime = startTime.getTime() === appointment.startTime.getTime() && finishTime.getTime() === appointment.finishTime.getTime();
         
         if (!isSameTime || dto.employeeId) {
             // Excluir el turno actual de la validación (para que no choque consigo mismo)
             if (await this.checkDisponibility(employeeIdToCheck, startTime, finishTime, id)) {
                throw new ForbiddenException('El empleado no está disponible en el nuevo horario calculado');
             }
         }
      }
    }

    try {
      // Utilizo save por la relacion manytomany, preload puede fallar!
      const mergedAppointment = this.appointmentsRepository.merge(appointment, updatedData);
      return await this.appointmentsRepository.save(mergedAppointment);

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error updating appointment: ${error?.message || error}`,
      );
    }
  }

  // --- REMOVE ---
  async remove(id: number, currentUser: CurrentUser) {
    if (!currentUser.salonId) {
      throw new ForbiddenException('This user is not associated with any salon');
    }
    const appointment = await this.findOne(id);

    if (!(appointment.salonId === currentUser.salonId)) {
      throw new ForbiddenException('No tiene permisos para eliminar este turno');
    }

    return await this.appointmentsRepository.remove(appointment);
  }

  async removeAll() {
    return await this.appointmentsRepository.deleteAll();
  }

  async cancel(id: number) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    appointment.status = 'cancelado';
    return await this.appointmentsRepository.save(appointment);
  }

  // --- HELPERS ---

  /**
   * Verifica si un empleado está disponible.
   * Se agregó 'excludeAppointmentId' para permitir actualizaciones del mismo turno sin que choque consigo mismo.
   */
  private async checkDisponibility(
    employeeId: number,
    startTime: Date,
    finishTime: Date,
    excludeAppointmentId?: number
  ): Promise<boolean> {
    
    const queryBuilder = this.appointmentsRepository.createQueryBuilder('appointment');

    queryBuilder
      .where('appointment.employeeId = :employeeId', { employeeId })
      .andWhere('appointment.status != :status', { status: 'cancelado' }) // Ignorar cancelados
      .andWhere(
        '(appointment.startTime < :finishTime AND appointment.finishTime > :startTime)',
        { startTime, finishTime }
      );

    if (excludeAppointmentId) {
        queryBuilder.andWhere('appointment.id != :id', { id: excludeAppointmentId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }
}