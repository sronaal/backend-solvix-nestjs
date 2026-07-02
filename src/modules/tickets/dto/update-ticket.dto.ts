import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {

    @IsEnum(['SIN ASIGNAR', 'ACTIVO', 'ESPERA', 'RESUELTO'])
    @IsOptional()
    estado?: string

    @IsEnum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA'])
    @IsOptional()
    prioridad?: string

    @IsString()
    @IsOptional()
    categoria?: string
    
}
