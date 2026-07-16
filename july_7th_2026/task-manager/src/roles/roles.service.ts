import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class RolesService {
    private readonly logger = new Logger(RolesService.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly cacheService: CacheService,
  ) {}

  async findByName(name: string) {
    return await this.roleRepository.findOne({
        where: { name },
    });
    }

    async findById(id: string) {
    const role = await this.roleRepository.findOne({
        where: { id },
    });

    if (!role) {
        throw new NotFoundException('Role not found');
    }

    return role;
    }

    async findAll() {
    return await this.roleRepository.find();
    }

    async create(data: Partial<Role>) {
        const role = this.roleRepository.create(data);
        const savedRole = await this.roleRepository.save(role);
        try {
            await this.cacheService.setRolePermissions(
                savedRole.id,
                savedRole.permissions,
            );
            } catch (error) {
            await this.cacheService.deleteRolePermissions(
                savedRole.id,
            );

            this.logger.error(
                `Failed to update cache for role ${savedRole.id}`,
                error instanceof Error ? error.stack : String(error),
            );
            }
        return savedRole;
    }

    async update(
    id: string,
    data: Partial<Role>,
    ) {
    const role = await this.findById(id);

    Object.assign(role, data);

    const updatedRole = await this.roleRepository.save(role);
    try {
        await this.cacheService.setRolePermissions(
            updatedRole.id,
            updatedRole.permissions,
        );
        } catch (error) {
        await this.cacheService.deleteRolePermissions(
            updatedRole.id,
        );
        this.logger.error(
            `Failed to update cache for role ${updatedRole.id}`,
            error instanceof Error ? error.stack : String(error),
        );
        }

    return updatedRole;
    }

    async delete(id: string) {
    const role = await this.findById(id);
    await this.roleRepository.remove(role);
        try {
    await this.cacheService.deleteRolePermissions(
        role.id,
    );
    } catch (error) {
    this.logger.error(
        `Failed to delete cache for role ${role.id}`,
        error instanceof Error ? error.stack : String(error),
    );
    }
    
    return role;
    }
}