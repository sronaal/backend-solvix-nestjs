import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTicketDto {
  @IsOptional()
  @IsEnum(['SIN ASIGNAR', 'ACTIVO', 'ESPERA', 'RESUELTO'])
  estado?: string;

  @IsOptional()
  @IsEnum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA'])
  prioridad?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  tecnico?: string;

  @IsOptional()
  @IsString()
  solicitante?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
