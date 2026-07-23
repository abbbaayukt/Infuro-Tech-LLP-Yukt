import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
@Module({
  imports: [ TypeOrmModule.forFeature([Task]), UsersModule, PermissionsModule, DatabaseModule],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
