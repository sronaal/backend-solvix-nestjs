import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) { }

  @Post()
  addComentarioTicket(@Body() createComentarioDTO: CreateComentarioDto) {

    return this.comentariosService.addComentarioTicket(createComentarioDTO)
  }
}
