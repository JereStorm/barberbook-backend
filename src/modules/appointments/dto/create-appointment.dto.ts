import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsString, IsDateString, Min } from 'class-validator';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsNumber()
  salonId: number;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  finishTime: string;

  @IsOptional()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'El estado debe ser válido' })
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  createdBy?: number;
}
