import { Role } from "src/roles/entities/role.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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


    @ManyToOne(
    () => Role,
    (rol) => rol.users,
    {  }
    )
    role: Role

}
