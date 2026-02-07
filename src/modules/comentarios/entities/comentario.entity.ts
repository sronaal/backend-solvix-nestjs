import { Ticket } from "src/modules/tickets/entities/ticket.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comentario {

    @PrimaryGeneratedColumn('uuid')
    id: string

    id_ticket: Ticket

    id_usuario: User

    contenido: string

    fecha_creacion: Date

    fecha_actualizacion: Date
}
