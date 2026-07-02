import { IsEnum, IsString } from 'class-validator';

export class CreateRoleDto {

    @IsString()
    @IsEnum(['ADMIN', 'TECNICO', 'SOLICITANTE'])
    nombre_rol: string
}
