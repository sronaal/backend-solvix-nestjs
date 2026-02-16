import { IsString } from "class-validator"

export class CreateComentarioDto {

    @IsString()
    id_ticket: string
    
    @IsString()
    id_usuario: string
    
    @IsString()
    contenido: string

}
