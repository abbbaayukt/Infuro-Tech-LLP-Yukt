import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Ticket]), PermissionsModule, DatabaseModule ],
  controllers: [
    TicketsController,
  ],
  providers: [
    TicketsService,
  ],
})
export class SupportModule {}