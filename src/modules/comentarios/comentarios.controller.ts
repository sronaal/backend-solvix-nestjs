import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) { }

  @Post()
  addComentarioTicket(@Body() createComentarioDTO: CreateComentarioDto) {
    return this.comentariosService.addComentarioTicket(createComentarioDTO)
  }

  @Get('ticket/:ticketId')
  findByTicket(@Param('ticketId') ticketId: string) {
    return this.comentariosService.findByTicket(ticketId);
  }

  @Roles('ADMIN', 'TECNICO')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateComentarioDto) {
    return this.comentariosService.update(id, updateDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comentariosService.remove(id);
  }
}
