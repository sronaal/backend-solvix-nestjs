import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { DataSource } from 'typeorm';

@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly dataSource: DataSource,
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

      numero_ticket: ticket.numero,
      titulo: ticket.titulo,
      descripcion: ticket.descripcion,
      solicitante: solicitanteFind,
      ...(tecnicoFind && {tecnico: tecnicoFind})
      
    })

    await this.ticketRepository.save(ticketCreate)

    return ticketCreate


  }

  async findAllTicketsForTabla() {
    const ticketsFind = await this.ticketRepository.find({
      relations: {
        solicitante: true,
        tecnico: true
      }
    })

    let tickets: any[] = []
    ticketsFind.map(ticket => {

      let ticketData = {
        "numero": ticket.numero_ticket,
        "titulo": ticket.titulo,
        "descripcion": ticket.descripcion,
        "fecha_creado": ticket.fecha_creado,
        "fecha_cierra": ticket.fecha_cierre,
        "fecha_actualizacion": ticket.fecha_actualizacion,
        "solicitante": `${ticket.solicitante.nombres} ${ticket.solicitante.apellidos}`,
        "tecnico": `${ticket.tecnico.nombres} ${ticket.tecnico.apellidos}`
      }
      tickets.push(ticketData)
      
      
    })

    return tickets
    
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

  async deleteAllTickets(){
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Ticket)
      .execute()

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log(error)
    } finally{
      await queryRunner.release()
    }

  }
}
