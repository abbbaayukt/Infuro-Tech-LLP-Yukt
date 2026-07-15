import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findByName(name: string) {
    return await this.roleRepository.findOne({
        where: { name },
    });
    }

    async findById(id: string) {
    return await this.roleRepository.findOne({
        where: { id },
    });
    }

    async findAll() {
    return await this.roleRepository.find();
    }

    async create(data: Partial<Role>) {
        const role = this.roleRepository.create(data);
        return await this.roleRepository.save(role);
    }

    async update(
    id: string,
    data: Partial<Role>,
    ) {
    const role = await this.findById(id);

    if (!role) {
        throw new NotFoundException('Role not found');
    }

    Object.assign(role, data);

    return await this.roleRepository.save(role);
    }

    async delete(id: string) {
    const role = await this.findById(id);

    if (!role) {
        throw new NotFoundException('Role not found');
    }

    return await this.roleRepository.remove(role);
    }
}