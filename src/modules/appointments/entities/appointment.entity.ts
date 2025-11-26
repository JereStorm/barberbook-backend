import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,

  //Lo agregue para el nuevo esquema de servicios y turnos
  ManyToMany,
  JoinTable,

  PrimaryGeneratedColumn,
} from "typeorm";
import { Salon } from "src/modules/salons/entities/salon.entity";
import { Client } from "src/modules/clients/entities/client.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Service } from "src/modules/services/entities/service.entity";

@Index("salon_id", ["salonId"], {})
@Index("start_time", ["startTime"], {})
@Index("finish_time", ["finishTime"], {})
@Index("duration", ["duration"], {})
@Index("client_id", ["clientId"], {})
@Index("employee_id", ["employeeId"], {})
@Index("status", ["status"], {})
//@Index("notes", ["notes"], {}) -> Lo deje no indexado
@Index("created_by", ["createdBy"], {})
@Index("updated_by", ["updatedBy"], {})
@Index("created_at", ["createdAt"], {})
@Entity("appointments", { schema: "barberbook" })
export class Appointment {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "salon_id" })
  salonId: number;

  @Column("timestamp", { name: "start_time" })
  startTime: Date;

  @Column("timestamp", { name: "finish_time" })
  finishTime: Date;

  @Column("int", { name: "duration" })
  duration: number; 

  // Columna para congelar el precio total
  @Column("decimal", { precision: 10, scale: 2, default: 0, name: "total_price" })
  totalPrice: number;

  @Column("int", { name: "client_id" })
  clientId: number;

  @Column("int", { name: "employee_id", nullable: true })
  employeeId: number | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: [
      "activo",
      "cancelado",
      "completado",
      "caducado",
    ],
    default: "activo",
  })
  status:
    | "activo"
    | "cancelado"
    | "completado"
    | "caducado"
    | null;

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
  employee: User | null;

  // RELACION MUCHOS A MUCHOS 
  @ManyToMany(() => Service)
  @JoinTable({
    name: "appointments_services",
    joinColumn: {
      name: "appointment_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "service_id",
      referencedColumnName: "id",
    },
  })
  services: Service[];

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
  updatedByUser: User | null;
}