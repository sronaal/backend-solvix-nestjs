import { User } from "../../user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'roles'})
export class Role {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        type: 'enum',
        enum: ['ADMIN','TECNICO', 'SOLICITANTE'],
        default: 'SOLICITANTE'
    })
    nombre_rol: string

    @OneToMany(() => User, 
    (user) => user.role,
    {onDelete: 'CASCADE'}
    )
    users: User[]
}
