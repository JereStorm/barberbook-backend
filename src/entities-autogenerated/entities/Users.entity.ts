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

@Index("email", ["email"], { unique: true })
@Index("salon_id", ["salonId"], {})
@Entity("users", { schema: "barberbook" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "salon_id" })
  salonId: number;

  @Column("varchar", { name: "email", unique: true, length: 150 })
  email: string;

  @Column("varchar", { name: "mobile", nullable: true, length: 20 })
  mobile: string | null;

  @Column("varchar", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("enum", { name: "role", enum: ["admin", "editor", "viewer"] })
  role: "admin" | "editor" | "viewer";

  @Column("tinyint", {
    name: "is_active",
    nullable: true,
    width: 1,
    default: "1",
  })
  isActive: boolean | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @OneToMany(() => Appointments, (appointments) => appointments.employee)
  appointments: Appointments[];

  @OneToMany(() => Appointments, (appointments) => appointments.createdByUser)
  created: Appointments[];

  @OneToMany(() => Appointments, (appointments) => appointments.updatedByUser)
  updated: Appointments[];

  @ManyToOne(() => Salons, (salons) => salons.users, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "salon_id", referencedColumnName: "id" }])
  salon: Salons;
}
