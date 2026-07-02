import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService
  ) { }



  async create(createTicketDto: CreateTicketDto) {

    let { solicitante, tecnico, ...ticket } = createTicketDto

    let solicitanteFind = await this.userService.findOne(solicitante)

    let tecnicoFind: User | null = null

    if (tecnico) {
      tecnicoFind = await this.userService.findOne(tecnico)
    }

    const ticketCreate = this.ticketRepository.create({

      numero_ticket: ticket.numero,
      titulo: ticket.titulo,
      descripcion: ticket.descripcion,
      solicitante: solicitanteFind,
      ...(tecnicoFind && { tecnico: tecnicoFind })

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

    return ticketsFind.map(ticket => ({
      id: ticket.id,
      numero: ticket.numero_ticket,
      titulo: ticket.titulo,
      descripcion: ticket.descripcion,
      estado: ticket.estado,
      prioridad: ticket.prioridad,
      categoria: ticket.categoria,
      fecha_creado: ticket.fecha_creado,
      fecha_cierra: ticket.fecha_cierre,
      fecha_actualizacion: ticket.fecha_actualizacion,
      solicitante: `${ticket.solicitante.nombres} ${ticket.solicitante.apellidos}`,
      tecnico: ticket.tecnico
        ? `${ticket.tecnico.nombres} ${ticket.tecnico.apellidos}`
        : null,
    }))

  }

  async findOne(id: number) {

    const ticket = await this.ticketRepository.findOneBy({ numero_ticket: id })

    if (!ticket) throw new NotFoundException(`ticket with number ${id} no found`)

    return ticket

  }

  async findOneById(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id })
    if (!ticket) throw new NotFoundException(`Ticket con id ${id} no encontrado`)
    return ticket
  }

  async update(id: string, ticketDTO: UpdateTicketDto) {

    const ticket = await this.ticketRepository.preload({
      id,
      ...(ticketDTO.titulo && { titulo: ticketDTO.titulo }),
      ...(ticketDTO.descripcion && { descripcion: ticketDTO.descripcion }),
      ...(ticketDTO.estado && { estado: ticketDTO.estado }),
      ...(ticketDTO.solicitante && { solicitante: { id: ticketDTO.solicitante } }),
      ...(ticketDTO.tecnico && { tecnico: { id: ticketDTO.tecnico } }),
      ...(ticketDTO.prioridad && { prioridad: ticketDTO.prioridad }),
      ...(ticketDTO.categoria && { categoria: ticketDTO.categoria }),
    })

    if (!ticket) throw new NotFoundException(`Ticket con id ${id} no encontrado`)

    try {
      return await this.ticketRepository.save(ticket);
    } catch (error) {
      this.logger.error(`Error al actualizar ticket ${id}: ${error.message}`, error.stack);
      throw error;
    }

  }

  async remove(id: string) {
    const ticket = await this.findOneById(id);
    await this.ticketRepository.remove(ticket);
    return { mensaje: `Ticket ${ticket.numero_ticket} eliminado correctamente` };
  }

  async deleteAllTickets() {
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
      this.logger.error(`Error al eliminar tickets: ${error.message}`, error.stack)
    } finally {
      await queryRunner.release()
    }

  }
}
