import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsString, IsDateString, Min, IsArray, ArrayMinSize } from 'class-validator';
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

  // Array de servicios (un turno puede tener multiples servicios)
  @IsArray({ message: 'serviceIds debe ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un servicio' })
  @IsNumber({}, { each: true, message: 'Cada ID de servicio debe ser un número' })
  serviceIds: number[];

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
