import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user-entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async createUser(username: string, password: string) {
    const user = this.userRepository.create({
      username,
      password,
    });

    return await this.userRepository.save(user);
  }
}