import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appointments } from "./Appointments.entity";
import { Clients } from "./Clients.entity";
import { Services } from "./Services.entity";
import { Users } from "./Users.entity";

@Entity("salons", { schema: "barberbook" })
export class Salons {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 150 })
  name: string;

  @Column("varchar", { name: "address", length: 255 })
  address: string;

  @Column("varchar", { name: "mobile", nullable: true, length: 20 })
  mobile: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @OneToMany(() => Appointments, (appointments) => appointments.salon)
  appointments: Appointments[];

  @OneToMany(() => Clients, (clients) => clients.salon)
  clients: Clients[];

  @OneToMany(() => Services, (services) => services.salon)
  services: Services[];

  @OneToMany(() => Users, (users) => users.salon)
  users: Users[];
}
