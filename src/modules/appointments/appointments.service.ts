import {
  ForbiddenException,
  Injectable,
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

@Injectable()
export class AppointmentsService {
  prisma: any;
  constructor(
    @InjectRepository(Appointment)
    @InjectRepository(Service)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly service: ServicesService,
  ) {}

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

  async findBySalon(salonId: number): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.find({
      where: { salonId },
      relations: ['client', 'service', 'salon'],
      order: { startTime: 'ASC' },
    });

    if (!appointments) {
      throw new NotFoundException(
        `Appointments with Saloon Id ${salonId} not found`,
      );
    }
    return appointments;
  }

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

    this.setFinishTime(dto, service.durationMin);

    if (!service) {
      throw new NotFoundException(
        `Service with ID ${dto.serviceId} not found or does not belong to your salon`,
      );
    }
    
    dto.duration = service.durationMin;

    if (dto.employeeId) {
      if(await this.checkDisponibility(dto)) {
        throw new ForbiddenException('El empleado no está disponible en este horario');
      }
    }

    console.log('create',dto);

    const appointment = this.appointmentsRepository.create(dto);
    return await this.appointmentsRepository.save(appointment);
  }

  async findAll(currentUser: CurrentUser): Promise<Appointment[]> {
    if (currentUser.salonId == null) {
      throw new ForbiddenException('El usuario no tiene salon asignado');
    }

    const data = await this.appointmentsRepository.find({
      relations: ['client', 'employee', 'service'],
      where: { salonId: currentUser.salonId },
    });

    console.log('findAll', data);

    return data;
  }

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

  async update(id: number, dto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);
    Object.assign(appointment, dto);
    return await this.appointmentsRepository.save(appointment);
  }

  async remove(id: number) {
    const appointment = await this.findOne(id);
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

  //calculations
  private async setFinishTime(dto: CreateAppointmentDto, duration: number) {
    const startTime = new Date(dto.startTime);
    const finishTime = new Date(startTime.getTime() + duration * 60000);
    dto.finishTime = finishTime.toISOString();
  }

  //validations
  private async checkDisponibility(
    dto: CreateAppointmentDto,
  ): Promise<boolean> {
    //verificar empleado asignado al turno
    //si empleado existe, verificar si ese empleado tiene turno en este horario
    //si pasa las verificaciones, retorna true

    // buscar solapamiento
    const result = await this.appointmentsRepository.findOne({
      where: {
        employeeId: dto.employeeId,
        startTime: LessThan(new Date(dto.finishTime)),
        finishTime: MoreThan(new Date(dto.startTime))
      },
    });

    console.log('validity',result);

    return result ? true : false; 
  }
}
