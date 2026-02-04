import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator"
import { Role } from "../../roles/entities/role.entity"

export class CreateUserDto {

    @IsString()
    @MinLength(1)
    nombres: string

    @IsString()
    @MinLength(1    )
    apellidos: string

    @IsString()
    @IsEmail()
    @MinLength(1)
    correo: string

    @IsString()
    @MinLength(6)
    password: string

    @IsBoolean()
    @IsOptional()
    activo?: boolean

    @IsString()
    @IsOptional()
    telefono?: string

    @IsString()
    departamento: string

    @IsEnum(['ADMIN', 'TECNICO', 'SOLICITANTE'])
    @IsOptional()
    role?: string

}
