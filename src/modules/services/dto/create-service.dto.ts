import { IsNotEmpty, IsString, IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateServiceDto {
    @IsNotEmpty()
    @IsNumber()
    salonId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(15)
    durationMin: number;

    @IsNotEmpty()
    @IsString()
    price: string;

    @IsBoolean()
    isActive?: boolean = true;
}
