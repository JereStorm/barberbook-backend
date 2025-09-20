//salon.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Service } from 'src/modules/services/entities/service.entity';

@Entity('salons')
export class Salon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mobile?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @OneToMany(() => User, (user) => user.salon)
  users: User[];

  @OneToMany(() => Appointment, (appointments) => appointments.salon)
  appointments: Appointment[];
  
  @OneToMany(() => Client, (clients) => clients.salon)
  clients: Client[];

  @OneToMany(() => Service, (services) => services.salon)
  services: Service[];
}