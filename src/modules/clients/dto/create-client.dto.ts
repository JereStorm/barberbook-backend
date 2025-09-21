import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsPhoneNumber,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClientDto {
  @IsNotEmpty({ message: 'El salón es obligatorio' })
  @IsNumber({}, { message: 'El ID del salón debe ser un número' })
  salonId: number;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 150, { message: 'El nombre debe tener entre 2 y 150 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string | null;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Debe proporcionar un número de teléfono válido' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  mobile?: string | null;
}
