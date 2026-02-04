import { Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { ROLES_SEED, USERS_SEED, TICKETS_SEED } from './data/data_users';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { TicketsService } from '../tickets/tickets.service';


@Injectable()
export class SeedService {

  constructor(
    private readonly rolService: RolesService,
    private readonly userServices: UserService,
    private readonly ticketServices: TicketsService
  ) { }


  async runSeed() {
    //await this.rolService.deteleAllRoles()
    //await this.createRols()
    //await this.userServices.deleteAllUsers()
    //await this.createUsers()
    await this.ticketServices.deleteAllTickets()
    await this.createTickets()

    return 'Seed de datos cargados a la base de datos'
  }

  private async createRols() {

    const roles = ROLES_SEED
    const insertPromises: Promise<any>[] = []

    roles.forEach(rol => {

      insertPromises.push(this.rolService.create({ "nombre_rol": rol }))


    })

    await Promise.all(insertPromises)
  }

  private async createUsers() {

    const insertPromisesUsers: Promise<any>[] = []

    const users = USERS_SEED

    users.forEach(user => {
      insertPromisesUsers.push(this.userServices.create({ password: user.hash_password, role: user.roleName, ...user }))
    })

    await Promise.all(insertPromisesUsers)
  }

  private async createTickets() {

    const tecnicos = await this.userServices.findUserByRol('TECNICO');
    const solicitantes = await this.userServices.findUserByRol('SOLICITANTE');

    // Validación de seguridad por si las tablas están vacías
    if (tecnicos.length === 0 || solicitantes.length === 0) {
      throw new Error('No hay técnicos o solicitantes en la DB para asociar tickets');
    }

    const tickets = TICKETS_SEED;

    const insertPromises = tickets.map((ticket, index) => {

      const asignadoTecnico = tecnicos[index % tecnicos.length];
      const asignadoSolicitante = solicitantes[index % solicitantes.length];

      return this.ticketServices.create({
        ...ticket,
        solicitante: asignadoSolicitante.id, 
        tecnico: asignadoTecnico.id,
      });
    });

    await Promise.all(insertPromises);
    console.log(`${tickets.length} tickets cargados correctamente.`);


  }


}
