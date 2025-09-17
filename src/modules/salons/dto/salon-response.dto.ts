import { Expose, Transform } from 'class-transformer';

export class SalonResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  mobile: string;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @Expose()
  usersCount?: number;

  @Expose()
  activeUsersCount?: number;

  @Expose()
  users?: {
    id: number;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
  }[];
}