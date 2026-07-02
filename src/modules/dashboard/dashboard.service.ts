import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../tickets/entities/ticket.entity';
import { User } from '../user/entities/user.entity';

interface RawCountRow {
  prioridad?: string;
  estado?: string;
  count: string;
}

interface TechnicianRow {
  id: string;
  nombre: string;
  count: string;
}

interface CategoryRow {
  categoria: string;
  count: string;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getStats() {
    const totalTickets = await this.ticketRepository.count();

    const [activeTickets, resolvedTickets, unassignedTickets] =
      await Promise.all([
        this.ticketRepository.count({ where: { estado: 'ACTIVO' } }),
        this.ticketRepository.count({ where: { estado: 'RESUELTO' } }),
        this.ticketRepository.count({ where: { tecnico: null } }),
      ]);

    const [priorityRaw, statusRaw, categoryRaw, technicianRaw, avgResult] =
      await Promise.all([
        this.ticketRepository
          .createQueryBuilder('ticket')
          .select('ticket.prioridad', 'prioridad')
          .addSelect('COUNT(ticket.id)', 'count')
          .groupBy('ticket.prioridad')
          .getRawMany<RawCountRow>(),

        this.ticketRepository
          .createQueryBuilder('ticket')
          .select('ticket.estado', 'estado')
          .addSelect('COUNT(ticket.id)', 'count')
          .groupBy('ticket.estado')
          .getRawMany<RawCountRow>(),

        this.ticketRepository
          .createQueryBuilder('ticket')
          .select('ticket.categoria', 'categoria')
          .addSelect('COUNT(ticket.id)', 'count')
          .where('ticket.categoria IS NOT NULL')
          .groupBy('ticket.categoria')
          .orderBy('COUNT(ticket.id)', 'DESC')
          .getRawMany<CategoryRow>(),

        this.ticketRepository
          .createQueryBuilder('ticket')
          .innerJoin('ticket.tecnico', 'technician')
          .innerJoin('technician.role', 'role')
          .select('technician.id', 'id')
          .addSelect(
            "CONCAT(technician.nombres, ' ', technician.apellidos)",
            'nombre',
          )
          .addSelect('COUNT(ticket.id)', 'count')
          .where('role.nombre_rol = :rol', { rol: 'TECNICO' })
          .groupBy('technician.id')
          .addGroupBy('technician.nombres')
          .addGroupBy('technician.apellidos')
          .getRawMany<TechnicianRow>(),

        this.ticketRepository
          .createQueryBuilder('ticket')
          .select(
            'AVG(EXTRACT(EPOCH FROM (ticket.fecha_cierre - ticket.fecha_creado)) / 3600)',
            'avgHours',
          )
          .where('ticket.estado = :estado', { estado: 'RESUELTO' })
          .andWhere('ticket.fecha_cierre IS NOT NULL')
          .getRawOne<{ avgHours: string | null }>(),
      ]);

    const recentTickets = await this.ticketRepository.find({
      relations: { solicitante: true, tecnico: true },
      order: { fecha_creado: 'DESC' },
      take: 10,
    });

    return {
      totalTickets,
      activeTickets,
      resolvedTickets,
      unassignedTickets,
      ticketsByPriority: {
        baja: this.findCount(priorityRaw, 'prioridad', 'BAJA'),
        media: this.findCount(priorityRaw, 'prioridad', 'MEDIA'),
        alta: this.findCount(priorityRaw, 'prioridad', 'ALTA'),
        critica: this.findCount(priorityRaw, 'prioridad', 'CRITICA'),
      },
      ticketsByStatus: {
        sin_asignar: this.findCount(statusRaw, 'estado', 'SIN ASIGNAR'),
        activo: this.findCount(statusRaw, 'estado', 'ACTIVO'),
        espera: this.findCount(statusRaw, 'estado', 'ESPERA'),
        resuelto: this.findCount(statusRaw, 'estado', 'RESUELTO'),
      },
      ticketsByCategory: categoryRaw.map((row) => ({
        categoria: row.categoria,
        count: parseInt(row.count, 10),
      })),
      ticketsByTechnician: technicianRaw.map((row) => ({
        id: row.id,
        nombre: row.nombre,
        count: parseInt(row.count, 10),
      })),
      avgResolutionTime: avgResult?.avgHours
        ? Math.round(parseFloat(avgResult.avgHours) * 100) / 100
        : 0,
      recentTickets: recentTickets.map((t) => ({
        id: t.id,
        numero: t.numero_ticket,
        titulo: t.titulo,
        estado: t.estado,
        prioridad: t.prioridad,
        categoria: t.categoria,
        fecha_creado: t.fecha_creado,
        solicitante: t.solicitante
          ? `${t.solicitante.nombres} ${t.solicitante.apellidos}`
          : null,
        tecnico: t.tecnico
          ? `${t.tecnico.nombres} ${t.tecnico.apellidos}`
          : null,
      })),
    };
  }

  /**
   * Safely looks up a row by key and returns its count, or 0 if not found.
   */
  private findCount(
    rows: RawCountRow[],
    key: 'prioridad' | 'estado',
    value: string,
  ): number {
    const found = rows.find((r) => r[key] === value);
    return found ? parseInt(found.count, 10) : 0;
  }
}
