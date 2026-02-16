import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { TicketsModule } from '../tickets/tickets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './entities/comentario.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TicketsModule,
    TypeOrmModule.forFeature([Comentario]),
    UserModule
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports:[
    TypeOrmModule,
    ComentariosService
  ]
})
export class ComentariosModule {}
