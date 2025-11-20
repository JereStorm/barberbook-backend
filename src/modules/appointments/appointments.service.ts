import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CurrentUser } from 'src/common/interfaces/current-user.interface';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Service } from '../services/entities/service.entity';
import { ServicesService } from '../services/services.service';

/**
 * Servicio para la gestión de turnos/citas.
 * Provee métodos para crear, obtener, actualizar, cancelar y eliminar turnos.
 */
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    @InjectRepository(Service)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly service: ServicesService,
  ) { }

  /**
   * Obtiene todos los turnos de un empleado específico.
   * @param employeeId ID del empleado.
   * @returns Array de turnos del empleado ordenados por hora de inicio.
   * @throws NotFoundException Si no se encuentran turnos para el empleado.
   */
  async findAllByEmployee(employeeId: number): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.find({
      where: { employeeId },
      relations: ['client', 'service', 'salon'],
      order: { startTime: 'ASC' },
    });

    if (!appointments) {
      throw new NotFoundException(
        `Appointments of user with id ${employeeId} not found`,
      );
    }
    return appointments;
  }

  /**
   * Crea un nuevo turno.
   * Valida permisos, disponibilidad del empleado y duración del servicio.
   * @param dto DTO con datos del turno a crear.
   * @param currentUser Usuario autenticado que realiza la solicitud.
   * @returns Turno creado.
   * @throws ForbiddenException Si el usuario no tiene permisos o el empleado no está disponible.
   * @throws NotFoundException Si el servicio no existe.
   */
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

    const service = await this.service.findOne(dto.serviceId, currentUser);

    if (!service) {
      throw new NotFoundException(
        `Service with ID ${dto.serviceId} not found or does not belong to your salon`,
      );
    }

    this.setFinishTime(dto, service);

    if (dto.employeeId) {
      if (await this.checkDisponibility(dto)) {
        throw new ForbiddenException(
          'El empleado no está disponible en este horario',
        );
      }
    }

    const appointment = this.appointmentsRepository.create(dto);
    return await this.appointmentsRepository.save(appointment);
  }

  /**
   * Obtiene todos los turnos de un salón específico.
   * @param currentUser Usuario autenticado (para obtener su salonId).
   * @returns Array de turnos del salón con relaciones cargadas.
   * @throws ForbiddenException Si el usuario no tiene un salón asignado.
   */
  async findAll(currentUser: CurrentUser): Promise<Appointment[]> {
    if (currentUser.salonId == null) {
      throw new ForbiddenException('El usuario no tiene salon asignado');
    }

    const data = await this.appointmentsRepository.find({
      relations: ['client', 'employee', 'service'],
      where: { salonId: currentUser.salonId },
    });

    return data;
  }

  /**
   * Obtiene un turno por su ID.
   * @param id ID del turno.
   * @returns Turno encontrado con todas sus relaciones.
   * @throws NotFoundException Si el turno no existe.
   */
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['client', 'employee', 'service', 'salon'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
    return appointment;
  }

  /**
   * Actualiza un turno existente.
   * Valida que el turno pertenezca al salón del usuario y recalcula la duración si cambia el servicio.
   * @param id ID del turno a actualizar.
   * @param dto DTO con los datos a actualizar.
   * @param currentUser Usuario autenticado que realiza la solicitud.
   * @returns Turno actualizado.
   * @throws ForbiddenException Si el usuario no tiene un salón asignado o no tiene permiso.
   * @throws NotFoundException Si el turno no existe.
   * @throws InternalServerErrorException Si hay error durante la actualización.
   */
  async update(
    id: number,
    dto: UpdateAppointmentDto,
    currentUser: CurrentUser,
  ): Promise<Appointment> {

    if (!currentUser.salonId) {
      throw new ForbiddenException('This user is not associated with any salon');
    }

    const appointment = await this.appointmentsRepository.findOne({
      where: { id, salonId: currentUser.salonId },
    });

    if (appointment && appointment.serviceId !== dto.serviceId) {
      const service = await this.service.findOne(dto.serviceId!, currentUser);
      this.setFinishTime(dto, service);
    }

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    try {
      const updatedAppointment = await this.appointmentsRepository.preload({
        id,
        ...dto,
      });

      if (!updatedAppointment) {
        throw new NotFoundException(`Cant update Appointment with ID ${id}`);
      }

      return await this.appointmentsRepository.save(updatedAppointment);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error updating appointment: ${error?.message || error}`,
      );
    }
  }

  /**
   * Elimina un turno.
   * Valida que el turno pertenezca al salón del usuario autenticado.
   * @param id ID del turno a eliminar.
   * @param currentUser Usuario autenticado que realiza la solicitud.
   * @returns Turno eliminado.
   * @throws ForbiddenException Si el usuario no tiene un salón asignado o no tiene permiso.
   * @throws NotFoundException Si el turno no existe.
   */
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

  /**
   * Elimina todos los turnos (uso administrativo/testing).
   * @returns Resultado de la eliminación.
   */
  async removeAll() {
    return await this.appointmentsRepository.deleteAll();
  }

  /**
   * Cancela un turno sin eliminarlo (cambia estado a "cancelado").
   * @param id ID del turno a cancelar.
   * @returns Turno cancelado.
   * @throws NotFoundException Si el turno no existe.
   */
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

  /**
   * Calcula y asigna la hora de finalización del turno basada en la duración del servicio.
   * @param dto DTO del turno (se modifica internamente).
   * @param service Servicio contratado.
   * @private
   */
  private async setFinishTime(dto: UpdateAppointmentDto, service: Service) {
    const startTime = new Date(dto.startTime!);
    const finishTime = new Date(startTime.getTime() + service.durationMin * 60000);
    dto.finishTime = finishTime.toISOString();
    dto.duration = service.durationMin;
  }

  /**
   * Verifica si un empleado está disponible en el horario solicitado.
   * Busca solapamientos con otros turnos del mismo empleado.
   * @param dto DTO con startTime, finishTime y employeeId.
   * @returns true si hay conflicto de horario, false si está disponible.
   * @private
   */
  private async checkDisponibility(
    dto: CreateAppointmentDto,
  ): Promise<boolean> {
    const result = await this.appointmentsRepository.findOne({
      where: {
        employeeId: dto.employeeId,
        startTime: LessThan(new Date(dto.finishTime)),
        finishTime: MoreThan(new Date(dto.startTime)),
      },
    });

    return result ? true : false;
  }
}
