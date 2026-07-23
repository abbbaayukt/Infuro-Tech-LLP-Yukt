import { Injectable } from '@nestjs/common';
import { Role } from '../roles/entities/role.entity';
import { User } from './entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { TenantDatabaseService } from '../common/database/tenant-database.service';
import { MasterUsersService } from '../master-users/master-users.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly tenantDatabase: TenantDatabaseService,
    private readonly rolesService: RolesService,
    private readonly masterUsersService: MasterUsersService,
  ) {}

  async findByUsername(username: string) {
    const userRepository = this.tenantDatabase.getRepository(User);
    return await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  async findById(id: string) {
    const userRepository = this.tenantDatabase.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id ${id} not found`,
      );
    }

    return user;
  }

  async createUser(
    username: string,
    password: string,
    role: Role,
    ) {
        const repo =
            this.tenantDatabase.getRepository(User);

        const user = repo.create({
            username,
            password,
            role,
        });

        return repo.save(user);
    }

  async findAll() {
    const userRepository = this.tenantDatabase.getRepository(User);
    return await userRepository.find();
  }

  async findOne(id: string) {
    const userRepository = this.tenantDatabase.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async delete(id: string) {
    const userRepository = this.tenantDatabase.getRepository(User);
    const user = await this.findOne(id);

    if (user.role.name === "ADMIN") {
      const adminCount = await this.countAdmins();

      if (adminCount === 1) {
        throw new ForbiddenException(
          'Cannot delete the last administrator',
        );
      }
    }

    await userRepository.remove(user);
    await this.masterUsersService.deactivate(user.id);
    return user;
  }

  async changeRole(
    userId: string,
    roleId: string,
  ) {
    const user = await this.findOne(userId);
    const newrole = await this.rolesService.findById(roleId);
    const userRepository = this.tenantDatabase.getRepository(User);
    if (!newrole) {
      throw new NotFoundException(
        `Role with id ${roleId} not found`,
      );
    }

    if (
      user.role.name === 'ADMIN' &&
      newrole.name !== 'ADMIN'
    ) {
        const adminCount = await this.countAdmins();

        if (adminCount === 1) {
            throw new ForbiddenException(
                'Cannot demote the last administrator',
            );
        }
    }

    user.role = newrole;
    await this.masterUsersService.updateRole(user.id, newrole.name);
    return await userRepository.save(user);
  }

  async countAdmins() {
    const userRepository = this.tenantDatabase.getRepository(User);
    return await userRepository.count({
      where: {
        role: { name: "ADMIN" },
      },
    });
  }

  async resetFailedAttempts(userId: string) {
    const userRepository =
      this.tenantDatabase.getRepository(User);

    await userRepository.update(userId, {
      failedLoginAttempts: 0,
      lockedUntil: null,
    });
  }

  async incrementFailedAttempts(
      user: User,
      maxAttempts: number,
      lockMinutes: number,
  ) {
      const userRepository =
          this.tenantDatabase.getRepository(User);

      user.failedLoginAttempts++;

      if (
          user.failedLoginAttempts >=
          maxAttempts
      ) {
          user.lockedUntil = new Date(
              Date.now() +
              lockMinutes * 60 * 1000,
          );
      }

      await userRepository.save(user);
  }
}