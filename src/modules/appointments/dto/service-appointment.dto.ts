import { Expose } from "class-transformer";

export class ServiceAppointmentDto {
    @Expose()
    id: number;

    @Expose()
    salonId: number;

    @Expose()
    name: string;

    @Expose()
    durationMin: number;

    @Expose()
    price: number;

    @Expose()
    isActive: boolean;
}