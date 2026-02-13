import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDTO } from './dto/auth-dto';
import { User } from '../user/entities/user.entity';

import { UserService } from '../user/user.service';
import { JWTPayload } from './dto/payload-jwt';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {

  }

  async iniciarSesion(authDTO: AuthDTO) {
    
    const { correo, password} = authDTO
   

    const user = await this.userService.findUserByCorreoForAuth(correo)
    
    if (!await bcrypt.compare(password, user.hash_password)) throw new UnauthorizedException('Correo y/o contraseña invalidos')

    const token = this.generateJWT({ id: user.id, activo: user.activo, rol: user.role.nombre_rol })
    console.log({user})
    return {
      id: user.id,
      nombre_usuario:  `${user.nombres} ${user.apellidos}`,
      activo: user.activo,
      rol: user.role.nombre_rol,
      token
    }

  }

  





  private generateJWT(payload: JWTPayload) {

    const token = this.jwtService.sign(payload)

    return token
  }
}
