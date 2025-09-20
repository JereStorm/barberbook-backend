import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Salon } from "src/modules/salons/entities/salon.entity";
import { Client } from "src/modules/clients/entities/client.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Service } from "src/modules/services/entities/service.entity";

@Index("client_id", ["clientId"], {})
@Index("created_by", ["createdBy"], {})
@Index("employee_id", ["employeeId"], {})
@Index("salon_id", ["salonId"], {})
@Index("service_id", ["serviceId"], {})
@Index("updated_by", ["updatedBy"], {})
@Entity("appointments", { schema: "barberbook" })
export class Appointment {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "salon_id" })
  salonId: number;

  @Column("timestamp", { name: "start_time" })
  startTime: Date;

  @Column("int", { name: "duration_min" })
  durationMin: number;

  @Column("int", { name: "client_id" })
  clientId: number;

  @Column("int", { name: "employee_id", nullable: true })
  employeeId: number | null;

  @Column("int", { name: "service_id" })
  serviceId: number;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["pending", "confirmed", "canceled", "completed"],
    default: "pending",
  })
  status: "pending" | "confirmed" | "canceled" | "completed" | null;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @Column("int", { name: "created_by" })
  createdBy: number;

  @Column("int", { name: "updated_by", nullable: true })
  updatedBy: number | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(() => Salon, (salons) => salons.appointments, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "salon_id", referencedColumnName: "id" }])
  salon: Salon;

  @ManyToOne(() => Client, (clients) => clients.appointments, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "client_id", referencedColumnName: "id" }])
  client: Client;

  @ManyToOne(() => User, (users) => users.appointments, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "employee_id", referencedColumnName: "id" }])
  employee: User;

  @ManyToOne(() => Service, (services) => services.appointments, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "service_id", referencedColumnName: "id" }])
  service: Service;

  @ManyToOne(() => User, (users) => users.createdBy, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "created_by", referencedColumnName: "id" }])
  createdByUser: User;

  @ManyToOne(() => User, (users) => users.updatedAt, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "updated_by", referencedColumnName: "id" }])
  updatedByUser: User;
}
