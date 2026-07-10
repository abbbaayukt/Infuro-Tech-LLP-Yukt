import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BaseCrudController } from '../common/base-crud.controller';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.tasksService.findOne(
      id,
      req.user.userId,
    );
  }

  @Post()
  create(
    @Body() dto: CreateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.createTask(
      dto,
      req.user.userId,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(
      id,
      req.user.userId,
      dto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.tasksService.delete(
      id,
      req.user.userId,
    );
  }
}