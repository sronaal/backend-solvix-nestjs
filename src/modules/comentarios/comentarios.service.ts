import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comentario } from './entities/comentario.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class ComentariosService {

  private readonly logger = new Logger(ComentariosService.name);

  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
    private readonly userService: UserService,
    private readonly ticketService: TicketsService
  ) { }

  async addComentarioTicket(createComentarioDTO: CreateComentarioDto) {

    const user = await this.userService.findUserById(createComentarioDTO.id_usuario)
    const ticket = await this.ticketService.findOneById(createComentarioDTO.id_ticket)

    try {
        const comentarioSave = this.comentarioRepository.create({
          id_usuario: user,
          ticket: ticket,
          contenido: createComentarioDTO.contenido
        })
        await this.comentarioRepository.save(comentarioSave)
        return comentarioSave;
    } catch (error) {
      this.logger.error(`Error al crear comentario: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByTicket(ticketId: string) {
    const comentarios = await this.comentarioRepository.find({
      where: { ticket: { id: ticketId } },
      relations: ['id_usuario'],
      order: { fecha_creacion: 'ASC' },
    });

    return comentarios.map((c) => ({
      id: c.id,
      contenido: c.contenido,
      autor: `${c.id_usuario.nombres} ${c.id_usuario.apellidos}`,
      fecha_creacion: c.fecha_creacion,
      fecha_actualizacion: c.fecha_actualizacion,
    }));
  }

  async findOne(id: string) {
    const comentario = await this.comentarioRepository.findOne({
      where: { id },
      relations: ['id_usuario', 'ticket'],
    });
    if (!comentario) throw new NotFoundException(`Comentario con id ${id} no encontrado`);
    return comentario;
  }

  async update(id: string, updateDto: UpdateComentarioDto) {
    const comentario = await this.findOne(id);
    if (updateDto.contenido) comentario.contenido = updateDto.contenido;
    await this.comentarioRepository.save(comentario);
    return comentario;
  }

  async remove(id: string) {
    const comentario = await this.findOne(id);
    await this.comentarioRepository.remove(comentario);
    return { mensaje: 'Comentario eliminado correctamente' };
  }

  private handleError(error: any) {
    this.logger.error(`Error en comentarios: ${error.message}`, error.stack);
    throw error;
  }
}
