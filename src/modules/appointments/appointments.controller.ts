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
} from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";

@Controller('appointments')

export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('employee/:id')
  //Falta verificacion que el usuario logueado sea el que unicamente pueda ver sus turnos
  async getAppointmentsByViewer(@Param('id', ParseIntPipe) userId: number) {
    const appointments = await this.appointmentsService.findAllByViewer(Number(userId));

    return {
      message: 'Appointments By User Fetched Successfully',
      data: appointments,
    };
  }

  @Get('salon/:id')
  async getAllByAdmin(@Param('id', ParseIntPipe) salonId: number) {
    const appointments = await this.appointmentsService.findAllByAdmin(Number(salonId));

    return {
      message: 'Appointments Fetched Successfully',
      data: appointments,
    };
  }

  @Get()
  async findAll() {
    return await this.appointmentsService.findAll();
  }
  
  @Get(":id")
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const appointment = await this.appointmentsService.findOne(id);
    
    return {
      message: 'Appointment Fetched Successfully',
      data: appointment,
    };
  }
  
  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    return await this.appointmentsService.create(dto);
  }

  @Put(":id")
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAppointmentDto) {
    const appointment = await this.appointmentsService.update(id, dto);

    return {
      message: 'Appointment Modified Successfully',
      data: appointment,
    };
  }

  @Patch(':id/cancel')
    async cancelAppointment(@Param('id', ParseIntPipe) id: number) {
    const appointment = await this.appointmentsService.cancel(id);

    return {
      message: 'Appointment Canceled Successfully',
      data: appointment,
    };
  }

  @Delete(":id")
  async remove(@Param('id', ParseIntPipe) id: number) {
    const appointment = await this.appointmentsService.remove(id);

    return {
      message: 'Appointment Deleted Successfully',
      data: appointment,
    };
  }

}
