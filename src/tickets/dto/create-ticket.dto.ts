import { IsNumber, IsOptional, IsString,  MinLength } from "class-validator"

export class CreateTicketDto {

    @IsNumber()
    numero: number

    @IsString()
    @MinLength(5)
    titulo: string

    @IsString()
    @MinLength(5)
    descripcion: string

    @IsString()
    solicitante: string

    @IsString()
    @IsOptional()
    tecnico: string
    
}
