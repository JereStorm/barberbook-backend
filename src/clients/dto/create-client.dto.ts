import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsNumber()
  salonId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  email?: string | null;

  @IsOptional()
  @IsString()
  mobile?: string;
}
