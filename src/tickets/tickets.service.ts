import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    private readonly userService: UserService
  ) { }



  async create(createTicketDto: CreateTicketDto) {

    let { solicitante, tecnico, ...ticket } = createTicketDto

    let solicitanteFind = await this.userService.findOne(solicitante)

    let tecnicoFind : User | null = null
    
    if(tecnico) {
       tecnicoFind = await this.userService.findOne(tecnico)
    }

    const ticketCreate = this.ticketRepository.create({
      numero: ticket.numero,
      titulo: ticket.titulo,
      descripcion: ticket.descripcion,
      solicitante: solicitanteFind,
      ...(tecnicoFind && {tecnico: tecnicoFind})
      
    })

    await this.ticketRepository.save(ticketCreate)

    return ticketCreate


  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
