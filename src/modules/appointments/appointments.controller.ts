import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  ParseIntPipe,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from '../users/entities/user.entity';
import { type CurrentUser } from 'src/common/interfaces/current-user.interface';
import { GetCurrentUser } from 'src/common/decorators/current-user.decorator';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { App } from 'supertest/types';

@Controller('appointments')
// Con '@UseGuards' le decimos a nest que todas las rutas de este controlador van a pasar por estos dos guards.
// Primero se va a chequear el 'JwtAuthGuard' para validar el token y despues el 'RolesGuard' para ver los permisos.
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    const appointments = await this.appointmentsService.create(
      createAppointmentDto,
      currentUser,
    );
    console.log(appointments);
    return {
      message: 'Turno Creado correctamente',

      data: appointments,
    };
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async findAll(
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<AppointmentResponseDto[]> {
    if (!currentUser.salonId) {
      throw new HttpException(
        { message: 'Missing salonId in current user' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const appointments = await this.appointmentsService.findAll(currentUser);
    return plainToInstance(AppointmentResponseDto, appointments, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPCIONISTA,
    UserRole.ESTILISTA,
  )
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentsService.findOne(id);

    if (!appointment) {
      throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
    }

    return plainToClass(AppointmentResponseDto, appointment, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<AppointmentResponseDto> {
    try {
      const updatedAppointment = await this.appointmentsService.update(
        id,
        dto,
        currentUser,
      );

      return plainToInstance(AppointmentResponseDto, updatedAppointment, {
        excludeExtraneousValues: true,
      });

    } catch (error) {
      throw new HttpException(
        {
          message: 'Error updating Appointment',
          error: error?.message || 'Unexpected error',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('cancel/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async cancelAppointment(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    const appointment = await this.appointmentsService.cancel(id);

    return {
      message: 'Appointment Canceled Successfully',
      data: appointment,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    const appointment = await this.appointmentsService.remove(id);

    return {
      message: 'Appointment Deleted Successfully',
      data: appointment,
    };
  }
  @Delete()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async removeAll(@GetCurrentUser() currentUser: CurrentUser) {
    const appointment = await this.appointmentsService.removeAll();

    return {
      message: 'Appointments Deleted Successfully',
      data: appointment,
    };
  }
}
