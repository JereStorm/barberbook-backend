import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { Salon } from "src/modules/salons/entities/salon.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("idx_clients_salon", ["salonId"], {})
@Entity("clients", { schema: "barberbook" })
export class Client {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "salon_id" })
  salonId: number;

  @Column("varchar", { name: "name", length: 150 })
  name: string;

  @Column("varchar", { name: "email", nullable: true, length: 150 })
  email: string | null;

  @Column("varchar", { name: "mobile", nullable: true, length: 20 })
  mobile: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @OneToMany(() => Appointment, (appointments) => appointments.client)
  appointments: Appointment[];

  @ManyToOne(() => Salon, (salons) => salons.clients, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "salon_id", referencedColumnName: "id" }])
  salon: Salon;
}
