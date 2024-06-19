import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard.ts';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getTickets() {
    return this.ticketService.getTickets();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getTicketById(@Param('id') id: string) {
    return this.ticketService.getTicketById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTicket(@Body() body: CreateTicketDto) {
    return this.ticketService.createTicket(body);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  deleteTickets(@Body() body: { ids: string[] }) {
    const { ids } = body;
    return this.ticketService.deleteTickets(ids);
  }
}
