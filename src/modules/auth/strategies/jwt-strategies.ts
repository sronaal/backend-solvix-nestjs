import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { id: string; activo: boolean; rol: string }) {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Token inválido: usuario no encontrado');
    }

    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo — contacte al administrador');
    }

    return {
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      activo: user.activo,
      rol: user.role.nombre_rol,
    };
  }

}
