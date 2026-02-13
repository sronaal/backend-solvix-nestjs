import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'tickets'})
export class Ticket {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('int',{
        unique: true,
    })
    numero_ticket: number

    @Column('text')
    titulo: string

    @Column({
        type: 'varchar',
        length: 500
    })
    descripcion: string

    @Column({
        type: 'enum',
        enum: ['SIN ASIGNAR','ACTIVO', 'ESPERA', 'RESUELTO'],
        default: 'ACTIVO'
    })
    estado: string

    @CreateDateColumn({
        type:'timestamp'
    })
    fecha_creado: Date

    @UpdateDateColumn({
        type: 'timestamp'
    })
    fecha_actualizacion: Date
    
    @Column(
        {nullable: true}
    )
    fecha_cierre: Date

    @ManyToOne(() => User, user => user.ticketsCreados)
    solicitante: User

    @ManyToOne(() => User, user => user.ticketsAsignados)
    tecnico: User
}
