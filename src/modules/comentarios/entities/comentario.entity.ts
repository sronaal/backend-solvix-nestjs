import { Ticket } from "src/modules/tickets/entities/ticket.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UpdateComentarioDto } from "../dto/update-comentario.dto";

@Entity()
export class Comentario {

    @PrimaryGeneratedColumn('uuid')
    id: string

    
    id_ticket: Ticket

    id_usuario: User
    @Column({
        type:'text',
        
    })
    contenido: string

    @CreateDateColumn()
    fecha_creacion: Date

    @UpdateDateColumn()
    fecha_actualizacion: Date
}
