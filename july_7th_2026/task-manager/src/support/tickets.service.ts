import { Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './entities/ticket.entity';
import { Scope } from '../permissions/enums/scope.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TenantDatabaseService } from '../common/database/tenant-database.service';
@Injectable()
export class TicketsService {
  constructor(
    private readonly tenantDatabase : TenantDatabaseService
  ) {}
  async findAll(
        userId: string,
        scope: Scope,
    ) {
      const ticketRepository = this.tenantDatabase.getRepository(Ticket); 
        if (scope === Scope.ALL) {
            return ticketRepository.find({
                relations:{
                    user:true,
                },
            });
        }
  
        return ticketRepository.find({
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

      const ticketRepository = this.tenantDatabase.getRepository(Ticket);
      if (scope === Scope.ALL) {
        ticket = await ticketRepository.findOne({
          where: { id },
          relations: {
            user: true,
          },
        });
      } else {
        ticket = await ticketRepository.findOne({
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
      const ticketRepository = this.tenantDatabase.getRepository(Ticket);
      const ticket = ticketRepository.create({
      title: createTicketDto.title,
      user: {
        id: userId,
      },
    });
  
      return await ticketRepository.save(ticket);
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
      const ticketRepository = this.tenantDatabase.getRepository(Ticket);
      Object.assign(ticket, updateTicketDto);
  
      return await ticketRepository.save(ticket);
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
      const ticketRepository = this.tenantDatabase.getRepository(Ticket);
      await ticketRepository.remove(ticket);
  
      return ticket;
    }

}