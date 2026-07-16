import { Body, Controller, Get, Post, Patch, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Action } from '../permissions/enums/action.enum';
import { Resource } from '../permissions/enums/resource.enum';
import { Permission } from '../permissions/decorators/permission.decorator';
import { PermissionGuard } from '../permissions/guards/permission.guard';
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Get()
  @Permission({ resource: Resource.TICKETS, action: Action.READ })
  findAll(@Request() req) {
    return this.ticketsService.findAll(
      req.user.userId,
      req.user.scope,
    );
  }

  @Get(':id')
  @Permission({ resource: Resource.TICKETS, action: Action.READ })
  findOne(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.ticketsService.findOne(
      id,
      req.user.userId,
      req.user.scope,
    );
  }

  @Post()
  @Permission({ resource: Resource.TICKETS, action: Action.CREATE })
  create(
    @Body() dto: CreateTicketDto,
    @Request() req,
  ) {
    return this.ticketsService.create(
      dto,
      req.user.userId,
    );
  }

  @Patch(':id')
  @Permission({ resource: Resource.TICKETS, action: Action.UPDATE })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @Request() req,
  ) {
    return this.ticketsService.update(
      id,
      req.user.userId,
      req.user.scope,
      dto,
    );
  }
  @Permission({ resource: Resource.TICKETS, action: Action.DELETE })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.ticketsService.delete(
      id,
      req.user.userId,
      req.user.scope,
    );
  }
}