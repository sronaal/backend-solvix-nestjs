import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    nombres: string

    @Column('text')
    apellidos: string

    @Column('text')
    correo: string

    @Column('text')
    hash_password: string

    @Column('bool', {
        default: true
    })
    activo: boolean

    @Column('text')
    telefono: string

    @Column('text')
    departamento: string

}
