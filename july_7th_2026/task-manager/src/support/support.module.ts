import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]), PermissionsModule,
  ],
  controllers: [
    TicketsController,
  ],
  providers: [
    TicketsService,
  ],
})
export class SupportModule {}