import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Salon } from '../salons/entities/salon.entity';
import { Service } from '../services/entities/service.entity';
import { ServicesModule } from '../services/services.module';
import { ServicesService } from '../services/services.service';

@Module({
  imports: [ServicesModule, TypeOrmModule.forFeature([Appointment, Client, Salon, Service])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}