import { Expose, Transform, Type } from 'class-transformer';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { ClientAppointmentDto } from './client-appointment.dto';
import { EmployeeAppointmentDto } from './employee-appointment.dto';
import { ServiceAppointmentDto } from './service-appointment.dto';

export class AppointmentResponseDto {
  @Expose()
  id: number;

  @Expose()
  salonId: number;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  startTime: Date;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : null))
  finishTime: Date;

  @Expose()
  duration: number;

  // Ahora los turnos se muestran con el precio total (suma del costo de los servicios individuales)
  @Expose()
  totalPrice: number;

  @Expose()
  clientId: number;

  @Expose()
  employeeId: number | null;


  @Expose()
  status: AppointmentStatus | null;

  @Expose()
  notes: string | null;

  @Expose()
  createdBy: number | null;

  // Un turno puede tener varios servicios, pasamos a tener un array de servicios
  @Expose()
  @Type(() => ServiceAppointmentDto) 
  services: ServiceAppointmentDto[]; 

  @Expose()
  @Type(() => ClientAppointmentDto)
  @Transform(({ value }) => {
    if (!value) return null;
    return {
      id: value.id,
      name: value.name,
      mobile: value.mobile
    };
  })
  client: ClientAppointmentDto | null;

  @Expose()
  @Type(() => EmployeeAppointmentDto)
  @Transform(({ value }) => {
    if (!value) return null;
    return {
      id: value.id,
      name: value.name,
      email: value.email,
      mobile: value.mobile,
      salonId: value.salonId,
      isActive: value.isActive,
    };
  })
  employee: EmployeeAppointmentDto | null;
}