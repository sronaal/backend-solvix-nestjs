import { Injectable } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comentario } from './entities/comentario.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class ComentariosService {

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

    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error){
    //console.log(error)
  }
}
