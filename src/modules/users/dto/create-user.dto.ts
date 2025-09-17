import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 150, { message: 'El nombre debe tener entre 2 y 150 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsPhoneNumber()
  mobile?: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @Length(8, 100, { message: 'La contraseña debe tener entre 8 y 100 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'
    }
  )
  password: string;

  @IsEnum(UserRole, { message: 'El rol debe ser válido' })
  role: UserRole;
}