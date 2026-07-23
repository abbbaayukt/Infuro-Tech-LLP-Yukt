import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { Scope } from './../permissions/enums/scope.enum';
import { TenantDatabaseService } from '../common/database/tenant-database.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly tenantDatabase: TenantDatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(
      userId: string,
      scope: Scope,
  ) {
    const taskRepository = this.tenantDatabase.getRepository(Task);
      if (scope === Scope.ALL) {
          return taskRepository.find({
              relations:{
                  user:true,
              },
          });
      }

      return taskRepository.find({
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
    let task: Task | null;

    const taskRepository = this.tenantDatabase.getRepository(Task); 
    if (scope === Scope.ALL) {
      task = await taskRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });
    } else {
      task = await taskRepository.findOne({
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

    if (!task) {
      throw new NotFoundException(
        `Task with id ${id} not found`,
      );
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    const taskRepository = this.tenantDatabase.getRepository(Task);
    const task = taskRepository.create({
    title: createTaskDto.title,
    user: {
      id: userId,
    },
  });

    return await taskRepository.save(task);
  }

  async update(
    id: string,
    userId: string,
    scope: Scope,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.findOne(
      id,
      userId,
      scope,
    );

    Object.assign(task, updateTaskDto);

    const taskRepository = this.tenantDatabase.getRepository(Task);
    return await taskRepository.save(task);
  }

  async delete(
    id: string,
    userId: string,
    scope: Scope,
  ) {
    const task = await this.findOne(
      id,
      userId,
      scope,
    );

    const taskRepository = this.tenantDatabase.getRepository(Task);
    await taskRepository.remove(task);

    return task;
  }
}