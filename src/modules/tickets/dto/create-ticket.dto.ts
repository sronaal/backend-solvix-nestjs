import { IsEnum, IsNumber, IsOptional, IsString, MinLength } from "class-validator"

export class CreateTicketDto {

    @IsNumber()
    numero: number

    @IsString()
    @MinLength(5)
    titulo: string

    @IsString()
    @MinLength(5)
    descripcion: string

    @IsEnum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA'])
    @IsOptional()
    prioridad?: string

    @IsString()
    @IsOptional()
    categoria?: string

    @IsString()
    solicitante: string

    @IsString()
    @IsOptional()
    tecnico: string
    
}
