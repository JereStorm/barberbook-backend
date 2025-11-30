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
  Query,
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
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * Controlador para la gestión de turnos/citas.
 * Provee endpoints para crear, obtener, actualizar, cancelar y eliminar turnos.
 * Todos los endpoints requieren autenticación JWT y validación de roles.
 */
@Controller('appointments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * @description Crea un nuevo turno.
   * @route POST /appointments
   * @access Solo para SUPER_ADMIN, ADMIN y RECEPCIONISTA.
   * @param createAppointmentDto Datos del turno a crear.
   * @param currentUser Usuario autenticado que realiza la solicitud.
   * @returns Objeto con mensaje de confirmación y datos del turno creado.
   * @throws ForbiddenException Si el usuario no tiene permisos.
   * @throws NotFoundException Si el servicio no existe.
   */
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
    return {
      message: 'Turno Creado correctamente',
      data: appointments,
    };
  }

  /**
   * @description Obtiene todos los turnos del salón del usuario autenticado.
   * @route GET /appointments
   * @access Solo para SUPER_ADMIN, ADMIN y RECEPCIONISTA.
   * @param currentUser Usuario autenticado (para obtener su salonId).
   * @returns Array de turnos en formato AppointmentResponseDto.
   * @throws HttpException Si el usuario no tiene un salonId asignado.
   */

  //Estilista agregado al get de turnos
  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPCIONISTA,
    UserRole.ESTILISTA,
  )
  async findAll(
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<AppointmentResponseDto[]> {
    // Si es Estilista, se utiliza el modo que tenemos en servicio
    if (currentUser.role === UserRole.ESTILISTA) {
      // Vamos con el ID de empleado
      const appointments = await this.appointmentsService.findAllByEmployee(
        currentUser.id,
      );
      return plainToInstance(AppointmentResponseDto, appointments, {
        excludeExtraneousValues: true,
      });
    }

    // Para Admin y Recepcionista, se sigue la logica original, se ve todo el salon
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

  /**
   * @description Obtiene todos los turnos del salón del usuario autenticado en el dia actual.
   * @route GET /appointments
   * @access Solo para SUPER_ADMIN, ADMIN y RECEPCIONISTA.
   * @param currentUser Usuario autenticado (para obtener su salonId).
   * @returns Array de turnos en formato AppointmentResponseDto.
   * @throws HttpException Si el usuario no tiene un salonId asignado.
   */

  //Estilista agregado al get de turnos
  @Get('today')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPCIONISTA,
    UserRole.ESTILISTA,
  )
  async findAllToday(
    @GetCurrentUser() currentUser: CurrentUser,
    @Query('cant') cant?: number,
  ): Promise<AppointmentResponseDto[]> {
    // Si es Estilista, se utiliza el modo que tenemos en servicio
    if (currentUser.role === UserRole.ESTILISTA) {
      // Vamos con el ID de empleado
      const appointments =
        await this.appointmentsService.findAllByEmployeeToday(currentUser.id, cant);
      return plainToInstance(AppointmentResponseDto, appointments, {
        excludeExtraneousValues: true,
      });
    }

    // Para Admin y Recepcionista, se sigue la logica original, se ve todo el salon
    if (!currentUser.salonId) {
      throw new HttpException(
        { message: 'Missing salonId in current user' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const appointments = await this.appointmentsService.findAllToday(currentUser, cant);
    return plainToInstance(AppointmentResponseDto, appointments, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * @description Obtiene un turno específico por ID.
   * @route GET /appointments/:id
   * @access SUPER_ADMIN, ADMIN, RECEPCIONISTA y ESTILISTA.
   * @param id ID del turno.
   * @returns Turno en formato AppointmentResponseDto.
   * @throws HttpException Si el turno no existe.
   */
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

  /**
   * @description Actualiza un turno existente.
   * @route PATCH /appointments/:id
   * @access Solo para SUPER_ADMIN, ADMIN y RECEPCIONISTA.
   * @param id ID del turno a actualizar.
   * @param dto Datos a actualizar del turno.
   * @param currentUser Usuario autenticado que realiza la solicitud.
   * @returns Turno actualizado en formato AppointmentResponseDto.
   * @throws HttpException Si hay error en la actualización.
   */

  //Estilista agregado al patch de turnos
  @Patch(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPCIONISTA,
    UserRole.ESTILISTA,
  )
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
          message: error.message,
          error: error?.message || 'Unexpected error',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * @description Cancela un turno (cambia su estado a "cancelado" sin eliminarlo).
   * @route PATCH /appointments/cancel/:id
   * @access Solo para SUPER_ADMIN, ADMIN y RECEPCIONISTA.
   * @param id ID del turno a cancelar.
   * @param currentUser Usuario autenticado que realiza la solicitud.
   * @returns Objeto con mensaje de confirmación y datos del turno cancelado.
   * @throws NotFoundException Si el turno no existe.
   */
  @Patch('cancel/:id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.RECEPCIONISTA,
    UserRole.ESTILISTA,
  )
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

  /**
   * @description Elimina un turno por ID.
   * @route DELETE /appointments/:id
   * @access Solo para SUPER_ADMIN, ADMIN y RECEPCIONISTA.
   * @param id ID del turno a eliminar.
   * @param currentUser Usuario autenticado que realiza la solicitud.
   * @returns Objeto con mensaje de confirmación y datos del turno eliminado.
   * @throws ForbiddenException Si el usuario no tiene permiso.
   * @throws NotFoundException Si el turno no existe.
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.RECEPCIONISTA)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    const appointment = await this.appointmentsService.remove(id, currentUser);

    return {
      message: 'Appointment Deleted Successfully',
      data: appointment,
    };
  }

  /**
   * @description Elimina todos los turnos (uso administrativo/testing).
   * @route DELETE /appointments
   * @access Solo para SUPER_ADMIN, ADMIN y RECEPCIONISTA.
   * @param currentUser Usuario autenticado que realiza la solicitud.
   * @returns Objeto con mensaje de confirmación.
   * @warning Esta acción elimina TODOS los turnos de la base de datos.
   */
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
