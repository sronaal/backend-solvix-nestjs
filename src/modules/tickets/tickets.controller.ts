import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAllTicketsForTabla(
    @Query(new ValidationPipe({ transform: true })) query: QueryTicketDto,
  ) {
    return this.ticketsService.findAllWithFilters(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOneById(id);
  }

  @Get('numero/:numero')
  findOneByNumero(@Param('numero') numero: string) {
    return this.ticketsService.findOne(+numero);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketDTO: UpdateTicketDto
    ){
    return this.ticketsService.update(id, updateTicketDTO)
  }

  @Roles('ADMIN', 'TECNICO')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
