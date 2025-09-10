import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointments } from "./Appointments.entity";
import { Salons } from "./Salons.entity";

@Index("salon_id", ["salonId"], {})
@Entity("services", { schema: "barberbook" })
export class Services {
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

  @OneToMany(() => Appointments, (appointments) => appointments.service)
  appointments: Appointments[];

  @ManyToOne(() => Salons, (salons) => salons.services, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "salon_id", referencedColumnName: "id" }])
  salon: Salons;
}
