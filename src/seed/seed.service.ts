import { Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { ROLES_SEED, USERS_SEED } from './data/data_users';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';


@Injectable()
export class SeedService {

  constructor(
    private readonly rolService: RolesService,
    private readonly userServices: UserService
  ) { }


  async runSeed(){
    //await this.rolService.deteleAllRoles()
    //await this.createRols()
    await this.userServices.deleteAllUsers()
    await this.createUsers()
  }

  private async createRols(){

    const roles = ROLES_SEED
    const insertPromises : Promise<any>[] = []

    roles.forEach(rol => {
      
      insertPromises.push(this.rolService.create({"nombre_rol": rol}))
      

    })
    
    await Promise.all(insertPromises)
  }

  private async createUsers(){

    const insertPromisesUsers : Promise<any>[] = []

    const users = USERS_SEED

    users.forEach(user => {
        insertPromisesUsers.push(this.userServices.create({password: user.hash_password, ...user}))
    })
    
    await Promise.all(insertPromisesUsers)
  }
  
  
}
