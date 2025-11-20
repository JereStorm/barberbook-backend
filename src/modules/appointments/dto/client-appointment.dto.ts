import { Expose, Transform } from 'class-transformer';

export class ClientAppointmentDto {
    @Expose()
    id: number;

    @Expose()
    salonId: number;

    @Expose()
    name: string;

    @Expose()
    email?: string | null;

    @Expose()
    mobile?: string | null;

}
