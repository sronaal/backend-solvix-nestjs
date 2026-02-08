import * as bcrypt from 'bcrypt';
import { Role } from "../../roles/entities/role.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    nombres: string

    @Column('text')
    apellidos: string

    @Column('text', {
        unique: true
    })
    correo: string

    @Column('text', {
        select: false
    })
    hash_password: string

    @Column('bool', {
        default: true
    })
    activo: boolean

    @Column('text')
    telefono: string

    @Column('text')
    departamento: string

    @CreateDateColumn({
        type: 'timestamp'
    })
    createdAt: Date

    @UpdateDateColumn({
        type: 'timestamp'
    })
    updateAt: Date


    @BeforeInsert()
    async convertir_password_hash(){
        this.hash_password = await bcrypt.hash(this.hash_password,10)
    }

    @ManyToOne(
    () => Role,
    (rol) => rol.users,
    {  }
    )
    role: Role

    @OneToMany(() => Ticket, ticket => ticket.solicitante)
    ticketsCreados: Ticket[]

    @OneToMany(() => Ticket, ticket => ticket.tecnico)
    ticketsAsignados: Ticket[]

}
