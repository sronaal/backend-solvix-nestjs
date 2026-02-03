import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator"

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

}
