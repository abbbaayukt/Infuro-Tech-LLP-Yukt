import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { Scope } from './../permissions/enums/scope.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(
      userId: number,
      scope: Scope,
  ) {

      if (scope === Scope.ALL) {
          return this.taskRepository.find({
              relations:{
                  user:true,
              },
          });
      }

      return this.taskRepository.find({
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
    id: number,
    userId: number,
    scope: Scope,
  ) {
    let task: Task | null;

    if (scope === Scope.ALL) {
      task = await this.taskRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });
    } else {
      task = await this.taskRepository.findOne({
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

  async createTask(createTaskDto: CreateTaskDto, userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      user: user,
    });

    return await this.taskRepository.save(task);
  }

  async update(
    id: number,
    userId: number,
    scope: Scope,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.findOne(
      id,
      userId,
      scope,
    );

    Object.assign(task, updateTaskDto);

    return await this.taskRepository.save(task);
  }

  async delete(
    id: number,
    userId: number,
    scope: Scope,
  ) {
    const task = await this.findOne(
      id,
      userId,
      scope,
    );

    await this.taskRepository.remove(task);

    return task;
  }
}