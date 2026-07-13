import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../users/enums/role.enum';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(userId: number, role: Role) {

    if (role === Role.ADMIN) {
      return await this.taskRepository.find({
        relations: {
          user: true,
        },
      });
    }
    return await this.taskRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });
}

  async findOne(
    id: number,
    userId: number,
    role: Role,
  ) {
    let task: Task | null;

    if (role === Role.ADMIN) {
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
  role: Role,
  updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.findOne(
      id,
      userId,
      role,
    );

    Object.assign(task, updateTaskDto);

    return await this.taskRepository.save(task);
  }

  async delete(
    id: number,
    userId: number,
    role: Role,
  ) {
    const task = await this.findOne(
      id,
      userId,
      role,
    );

    await this.taskRepository.remove(task);

    return task;
  }
}