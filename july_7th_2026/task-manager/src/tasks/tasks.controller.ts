import { Body, Controller, Get, Post, Patch, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Action } from '../permissions/enums/action.enum';
import { Resource } from '../permissions/enums/resource.enum';
import { Permission } from '../permissions/decorators/permission.decorator';
import { PermissionGuard } from '../permissions/guards/permission.guard';
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  @Permission({
    resource: Resource.TASKS,
    action: Action.READ,
  })
  findAll(@Request() req) {
    return this.tasksService.findAll(
      req.user.userId,
      req.user.scope,
    );
  }

  @Get(':id')
  @Permission({
    resource: Resource.TASKS,
    action: Action.READ,
  })
  findOne(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.tasksService.findOne(
      id,
      req.user.userId,
      req.user.scope,
    );
  }

  @Post()
  @Permission({
    resource: Resource.TASKS,
    action: Action.CREATE,
  })
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
  @Permission({
    resource: Resource.TASKS,
    action: Action.UPDATE,
  })
  update(
    @Param('id') id: string,
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
  @Permission({
    resource: Resource.TASKS,
    action: Action.DELETE,
  })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.tasksService.delete(
      id,
      req.user.userId,
      req.user.scope,
    );
  }
}