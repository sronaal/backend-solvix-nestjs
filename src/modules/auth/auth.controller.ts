import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth-dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  iniciarSesion(@Body() authDTO: AuthDTO){
    
    return this.authService.iniciarSesion(authDTO)
  }

  @Public()
  @Post('verify')
  verifyToken(@CurrentUser() user: any){
    return { valido: true, usuario: user }
  }
}
