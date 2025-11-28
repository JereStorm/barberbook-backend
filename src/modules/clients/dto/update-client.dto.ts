import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsOptional, IsString, IsEmail, Length, IsPhoneNumber, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateClientDto extends PartialType(CreateClientDto) {
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Length(2, 150, { message: 'El nombre debe tener entre 2 y 150 caracteres' })
    @Transform(({ value }) => value?.trim())
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Debe proporcionar un email válido' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email?: string | null;

    @IsOptional()
    @IsPhoneNumber('AR', { message: 'Debe proporcionar un número de teléfono argentino válido' })
    @Transform(({ value }) => (value === '' ? undefined : value))
    mobile?: string | null;
}
