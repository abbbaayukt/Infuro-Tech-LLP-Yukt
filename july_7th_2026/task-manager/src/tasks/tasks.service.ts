import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
  private nextId = 3;
  private tasks = [
    {
      id: 1,
      title: 'Learn NestJS',
      completed: false,
    },
    {
      id: 2,
      title: 'Build Tasks API',
      completed: false,
    },
  ];

  findAll() {
    return this.tasks;
  }

  findOne(id: string) {
    const task = this.tasks.find((task) => task.id === Number(id));

    if (!task) {
        throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
    }

  create(createTaskDto: CreateTaskDto) {
    const newTask = {
      id: this.nextId++,
      title: createTaskDto.title,
      completed: false,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.findOne(id);

    if (updateTaskDto.title !== undefined) {
        task.title = updateTaskDto.title;
    }

    if (updateTaskDto.completed !== undefined) {
        task.completed = updateTaskDto.completed;
    }

    return task;
    }

    remove(id: string) {
    const index = this.tasks.findIndex(
        (task) => task.id === Number(id),
    );

    if (index === -1) {
        throw new NotFoundException(`Task with id ${id} not found`);
    }

    const deletedTask = this.tasks[index];
      this.tasks.splice(index, 1);

    return deletedTask;
    }
}