export class CreateClientDto {
  salonId: number;
  name: string;
  email?: string | null;
  mobile?: string;
}
