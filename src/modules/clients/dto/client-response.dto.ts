import { Expose, Transform } from 'class-transformer';

export class ClientResponseDto {
    @Expose()
    id: number;

    @Expose()
    salonId: number;

    @Expose()
    name: string;

    @Expose()
    email?: string | null;

    @Expose()
    mobile?: string | null;

    @Expose()
    @Transform(({ value }) => {
        if (!value) return null;
        return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
    })
    createdAt: Date;

}
