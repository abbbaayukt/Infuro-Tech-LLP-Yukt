import { Controller, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BaseCrudController } from '../common/base-crud.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController extends BaseCrudController<
  CreateTaskDto,
  UpdateTaskDto
> {
  constructor(private readonly tasksService: TasksService) {
    super(tasksService);
  }
}