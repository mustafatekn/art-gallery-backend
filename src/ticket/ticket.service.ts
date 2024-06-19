import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from 'src/ticket/schemas/ticket.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateTicketDto } from './dtos/create-ticket.dto';
@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
  ) {}

  getTickets() {
    return this.ticketModel.find().exec();
  }

  async getTicketById(id: string): Promise<Ticket> {
    if (!isValidObjectId(id))
      throw new BadRequestException(`Ticket id ${id} is not valid`);
    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) throw new NotFoundException(`Ticket with id ${id} not found`);
    return ticket;
  }

  createTicket(ticket: CreateTicketDto) {
    return this.ticketModel.create(ticket);
  }

  async deleteTickets(ids: string[]) {
    if (!ids.every((id) => isValidObjectId(id)))
      throw new BadRequestException(`There are some invalid ids in id list.`);
    const result = await this.ticketModel
      .deleteMany({ _id: { $in: ids } })
      .exec();
    return { deletedCount: result.deletedCount };
  }
}
