import { Expose } from 'class-transformer';

/**
 * DTO de respuesta para servicios, diseñado para exponer solo los datos necesarios
 * al cliente, siguiendo la estructura de la tabla 'services' de la base de datos.
 */
export class ServiceResponseDto {
    /**
     * El ID único del servicio.
     */
    @Expose()
    id: number;

    /**
     * El ID del salón al que pertenece el servicio.
     */
    @Expose()
    salonId: number;

    /**
     * El nombre del servicio (p. ej., 'Corte de Pelo', 'Manicura').
     */
    @Expose()
    name: string;

    /**
     * La duración del servicio en minutos.
     */
    @Expose()
    durationMin: number;

    /**
     * El precio del servicio.
     */
    @Expose()
    price: number;

    /**
     * Indica si el servicio está activo y disponible.
     */
    @Expose()
    isActive: boolean;
}