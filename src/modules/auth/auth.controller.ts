import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth-dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  iniciarSesion(@Body() authDTO: AuthDTO){
    console.log("Controller", authDTO)
    return this.authService.iniciarSesion(authDTO)
  }
}
