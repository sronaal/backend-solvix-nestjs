import { IsString } from "class-validator"

export class AuthDTO{

    @IsString()
    correo: string

    @IsString()
    password: string
}