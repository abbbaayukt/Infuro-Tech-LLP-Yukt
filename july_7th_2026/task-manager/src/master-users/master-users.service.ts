import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterUser } from './entities/master-user.entity';

@Injectable()
export class MasterUsersService {
  constructor(
    @InjectRepository(MasterUser)
    private readonly repository: Repository<MasterUser>,
  ) {}

  async create(
    userId: string,
    tenantId: string,
    tenantName: string,
    username: string,
    roleName: string,
  ) {
    const user = this.repository.create({
      userId,
      tenantId,
      tenantName,
      username,
      roleName,
    });

    return this.repository.save(user);
  }

  async deactivate(id: string) {
    await this.repository.update(id, {
      isActive: false,
    });
  }

  async updateRole(
    userId: string,
    roleName: string,
  ) {
    await this.repository.update(
            {
                userId,
            },
            {
                roleName,
            },
        );
    }
}
