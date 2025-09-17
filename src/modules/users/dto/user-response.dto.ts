// user-response.dto.ts
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';

class SalonResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  address?: string;
}

class CreatorResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  mobile?: string;

  @Expose()
  role: UserRole;

  @Expose()
  salonId: number | null;

  @Expose()
  isActive: boolean;

  @Expose()
  createdBy: number | null;

  @Expose()
  @Transform(({ value }) => value ? new Date(value).toISOString() : null)
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => value ? new Date(value).toISOString() : null)
  updatedAt: Date;

  @Expose()
  @Type(() => SalonResponseDto)
  @Transform(({ value }) => {
    if (!value) return null;
    return {
      id: value.id,
      name: value.name,
      address: value.address
    };
  })
  salon: SalonResponseDto | null;

  @Expose()
  @Type(() => CreatorResponseDto)
  @Transform(({ value }) => {
    if (!value) return null;
    return {
      id: value.id,
      name: value.name,
      email: value.email
    };
  })
  creator: CreatorResponseDto | null;

  @Exclude()
  passwordHash: string;
}