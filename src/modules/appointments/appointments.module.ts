import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Salon } from '../salons/entities/salon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Client, Salon])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}