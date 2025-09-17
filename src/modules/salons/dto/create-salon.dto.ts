import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateSalonAdminDto {
  @IsNotEmpty({ message: 'El nombre del administrador es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 150, { message: 'El nombre debe tener entre 2 y 150 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: 'Debe proporcionar un email válido para el administrador' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsPhoneNumber('AR', { message: 'Debe proporcionar un número de teléfono argentino válido' })
  mobile?: string;


  @IsNotEmpty({ message: 'La contraseña del administrador es obligatoria' })
  @IsString()
  @Length(8, 100, { message: 'La contraseña debe tener entre 8 y 100 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'
    }
  )
  password: string;
}

export class CreateSalonDto {
  @IsNotEmpty({ message: 'El nombre del salón es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 150, { message: 'El nombre debe tener entre 2 y 150 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Length(5, 255, { message: 'La dirección debe tener entre 5 y 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  address?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsPhoneNumber('AR', { message: 'Debe proporcionar un número de teléfono argentino válido' })
  mobile?: string;

  @ValidateNested()
  @Type(() => CreateSalonAdminDto)
  admin: CreateSalonAdminDto;
}