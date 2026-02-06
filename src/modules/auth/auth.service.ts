import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDTO } from './dto/auth-dto';
import { User } from '../user/entities/user.entity';

import { UserService } from '../user/user.service';



@Injectable()
export class AuthService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){

  }
  
  async iniciarSesion(authDTO: AuthDTO){

    const { password, correo} = authDTO
    const user = await this.userRepository.findOneBy({correo})

    if(!user) throw new UnauthorizedException('Correo y/o contraseña invalidos')
    
    if(!await bcrypt.compare(authDTO.password, user.hash_password)) throw new UnauthorizedException('Correo y/o contraseña invalidos') 
    
    // to-do generar jwt 
    
    return user
    
  }
}
