import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Scope } from '../permissions/enums/scope.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}
  async findAll(
        userId: string,
        scope: Scope,
    ) {
  
        if (scope === Scope.ALL) {
            return this.ticketRepository.find({
                relations:{
                    user:true,
                },
            });
        }
  
        return this.ticketRepository.find({
            where:{
                user:{
                    id:userId,
                },
            },
            relations:{
                user:true,
            },
        });
    }
  
    async findOne(
      id: string,
      userId: string,
      scope: Scope,
    ) {
      let ticket: Ticket | null;
  
      if (scope === Scope.ALL) {
        ticket = await this.ticketRepository.findOne({
          where: { id },
          relations: {
            user: true,
          },
        });
      } else {
        ticket = await this.ticketRepository.findOne({
          where: {
            id,
            user: {
              id: userId,
            },
          },
          relations: {
            user: true,
          },
        });
      }
  
      if (!ticket) {
        throw new NotFoundException(
          `Ticket with id ${id} not found`,
        );
      }
  
      return ticket;
    }
  
    async create(createTicketDto: CreateTicketDto, userId: string) {
    
      const ticket = this.ticketRepository.create({
      title: createTicketDto.title,
      user: {
        id: userId,
      },
    });
  
      return await this.ticketRepository.save(ticket);
    }
  
    async update(
      id: string,
      userId: string,
      scope: Scope,
      updateTicketDto: UpdateTicketDto,
    ) {
      const ticket = await this.findOne(
        id,
        userId,
        scope,
      );
  
      Object.assign(ticket, updateTicketDto);
  
      return await this.ticketRepository.save(ticket);
    }
  
    async delete(
      id: string,
      userId: string,
      scope: Scope,
    ) {
      const ticket = await this.findOne(
        id,
        userId,
        scope,
      );
  
      await this.ticketRepository.remove(ticket);
  
      return ticket;
    }

}