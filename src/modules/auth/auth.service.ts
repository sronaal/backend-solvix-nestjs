import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDTO } from './dto/auth-dto';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){

  }
  
  async iniciarSesion(authDTO: AuthDTO){

    const user = await this.userRepository.findOneBy({correo: authDTO.correo})

    if(!user) throw new UnauthorizedException('Correo y/o contraseña invalidos')
    
    
    
    
  }
}
