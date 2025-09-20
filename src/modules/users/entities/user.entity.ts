//user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';
import { Salon } from '../../salons/entities/salon.entity';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'salon_id', nullable: true })
  salonId: number | null;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mobile?: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  @Exclude() 
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Salon, (salon) => salon.users, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'salon_id' })
  salon: Salon;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => Appointment, (appointments) => appointments.employee)
  appointments: Appointment[];

  @OneToMany(() => Appointment, (appointments) => appointments.createdBy)
  created: Appointment[];

  @OneToMany(() => Appointment, (appointments) => appointments.updatedBy)
  updated: Appointment[];

  isSuperAdmin(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canManageSalon(salonId: number): boolean {
    if (this.isSuperAdmin()) return true;
    return this.salonId === salonId;
  }

  canCreateRole(targetRole: UserRole): boolean {
    switch (this.role) {
      case UserRole.SUPER_ADMIN:
        return true;
      case UserRole.ADMIN:
        return [UserRole.RECEPCIONISTA, UserRole.ESTILISTA].includes(targetRole);
      case UserRole.RECEPCIONISTA:
        return targetRole === UserRole.ESTILISTA;
      default:
        return false;
    }
  }
}