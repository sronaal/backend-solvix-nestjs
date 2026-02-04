import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    UserModule
  ],
  exports: [
    TypeOrmModule,
    TicketsService
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule { }
