import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './enums/role.enum';
import { User } from './entities/user-entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async createUser(username: string, password: string, role: Role) {
    const user = this.userRepository.create({
      username,
      password,
      role,
    });

    return await this.userRepository.save(user);
  }

  async findAll() {
  return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async delete(id: number) {
    const user = await this.findOne(id);

    if (user.role === Role.ADMIN) {
      const adminCount = await this.countAdmins();

      if (adminCount === 1) {
        throw new ForbiddenException(
          'Cannot delete the last administrator',
        );
      }
    }

    await this.userRepository.remove(user);

    return user;
  }

  async changeRole(
    id: number,
    role: Role,
  ) {
    const user = await this.findOne(id);

    if (
      user.role === Role.ADMIN &&
      role === Role.USER
    ) {
      const adminCount = await this.countAdmins();

      if (adminCount === 1) {
        throw new ForbiddenException(
          'Cannot demote the last administrator',
        );
      }
    }

    user.role = role;

    return await this.userRepository.save(user);
  }

  async countAdmins() {
    return await this.userRepository.count({
      where: {
        role: Role.ADMIN,
      },
    });
  }
}