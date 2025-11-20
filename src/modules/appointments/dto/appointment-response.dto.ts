import { Expose, Transform, Type } from 'class-transformer';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { ClientResponseDto } from 'src/modules/clients/dto/client-response.dto';
import { ServiceResponseDto } from 'src/modules/services/dto/service-response.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
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

  @Expose()
  clientId: number;

  @Expose()
  employeeId: number | null;

  @Expose()
  serviceId: number;

  @Expose()
  status: AppointmentStatus | null;

  @Expose()
  notes: string | null;

  @Expose()
  createdBy: number | null;

  @Expose()
  @Type(() => ServiceAppointmentDto)
  @Transform(({ value }) => {
    if (!value) return null;
    return {
      id: value.id,
      salonId: value.salon_id,
      name: value.name,
      durationMin: value.duration_min,
      price: value.price,
      isActive: value.is_active,
    };
  })
  service: ServiceAppointmentDto | null;

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
