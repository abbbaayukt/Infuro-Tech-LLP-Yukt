import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Action } from '../permissions/enums/action.enum';
import { Resource } from '../permissions/enums/resource.enum';
import { Permission } from '../auth/decorators/permission.decorator';
import { PermissionGuard } from '../permissions/guards/permission.guard';
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  @Permission(
    Resource.TASKS,
    Action.READ,
  )
  findAll(@Request() req) {
    return this.tasksService.findAll(
      req.user.userId,
      req.user.scope,
    );
  }

  @Get(':id')
  @Permission(Resource.TASKS, Action.READ)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.tasksService.findOne(
      id,
      req.user.userId,
      req.user.scope,
    );
  }

  @Post()
  @Permission(Resource.TASKS, Action.CREATE)
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
  @Permission(Resource.TASKS, Action.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(
      id,
      req.user.userId,
      req.user.scope,
      dto,
    );
  }
  @Permission(Resource.TASKS, Action.DELETE)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.tasksService.delete(
      id,
      req.user.userId,
      req.user.scope,
    );
  }
}