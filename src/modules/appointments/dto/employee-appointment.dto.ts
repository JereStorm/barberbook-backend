import { Expose } from "class-transformer";

export class EmployeeAppointmentDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  mobile?: string;

  @Expose()
  salonId: number | null;

  @Expose()
  isActive: boolean;
}