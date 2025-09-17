import { UserRole } from '../enums/user-role.enum';

export interface CurrentUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  salonId: number | null;
  isActive: boolean;
}