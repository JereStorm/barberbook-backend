import { Expose, Transform, Type } from 'class-transformer';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { ServiceResponseDto } from 'src/modules/services/dto/service-response.dto';
import { Service } from 'src/modules/services/entities/service.entity';

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
  @Type(() => ServiceResponseDto)
   @Transform(({ value }) => {
     if (!value) return null;
     return {
       id: value.id,
       name: value.name,
       durationMin: value.duration_min,
       price: value.price,
     };
   })
   service: ServiceResponseDto | null;
}
