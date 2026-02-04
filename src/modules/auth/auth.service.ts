import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthDTO } from './dto/auth-dto';

@Injectable()
export class AuthService {
  
  iniciarSesion(authDTO: AuthDTO){}
}
