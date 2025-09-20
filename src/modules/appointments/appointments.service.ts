import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';


@Injectable()
export class AppointmentsService {
   constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
  ) {}

  async findAllByViewer(employeeId: number): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.find({
      where: { employeeId },
      relations: ['client', 'service', 'salon'],
      order: { startTime: 'ASC' },
    });

    if (!appointments) {
      throw new NotFoundException(`Appointments of user with id ${employeeId} not found`);
    }
    return appointments;
  }
  
  async findAllByAdmin(salonId: number): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.find({
      where: { salonId },
      relations: ['client', 'service', 'salon'],
      order: { startTime: 'ASC' },
    });

    if (!appointments) {
      throw new NotFoundException(`Appointments with Saloon Id ${salonId} not found`);
    }
    return appointments;
  }

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentsRepository.create(dto);
    return await this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentsRepository.find({
      relations: ["client", "employee", "service", "salon"],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ["client", "employee", "service", "salon"],
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

  async cancel(id: number) {
    const appointment = await this.appointmentsRepository.findOne({ where: { id } });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    appointment.status = 'canceled';

    return await this.appointmentsRepository.save(appointment);
  }
  
}
