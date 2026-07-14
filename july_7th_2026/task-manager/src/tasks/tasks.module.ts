import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UsersModule } from '../users/users.module';
import { PermissionsModule } from '../permissions/permissions.module';
@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, PermissionsModule],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
