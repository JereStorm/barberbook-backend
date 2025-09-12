
export class CreateServiceDto {
    salonId: number;
    name: string;
    durationMin: number;
    price: string;
    isActive?: boolean = true;
}
