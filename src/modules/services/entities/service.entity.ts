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

@Index("salon_id", ["salonId"], {})
@Entity("services", { schema: "barberbook" })
export class Service {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "salon_id" })
  salonId: number;

  @Column("varchar", { name: "name", length: 150 })
  name: string;

  @Column("int", { name: "duration_min" })
  durationMin: number;

  @Column("decimal", { name: "price", precision: 10, scale: 2 })
  price: string;

  @Column("tinyint", {
    name: "is_active",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  isActive: boolean | null;

  @OneToMany(() => Appointment, (appointments) => appointments.service)
  appointments: Appointment[];

  @ManyToOne(() => Salon, (salons) => salons.services, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "salon_id", referencedColumnName: "id" }])
  salon: Salon;
}
