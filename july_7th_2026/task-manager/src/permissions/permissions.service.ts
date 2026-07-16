import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './enums/resource.enum';
import { Action } from './enums/action.enum';
import { Scope } from './enums/scope.enum';
import { Role } from '../roles/entities/role.entity';
import { CacheService } from '../common/cache/cache.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly cacheService: CacheService,
  ) {}

  async validatePermission(
    roleId: string,
    resource: Resource,
    action: Action,
  ): Promise<{
    allowed: boolean;
    scope: Scope;
  }> {
    console.log('role id',roleId );
    let permissions = await this.cacheService.getRolePermissions(roleId);

    if (!permissions) {
      console.log('cache miss');
      const role = await this.roleRepository.findOne({
        where: { id: roleId },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      permissions = role.permissions;

      await this.cacheService.setRolePermissions(
        roleId,
        permissions,
      );
    } else {
    console.log('cache hit');}
    const permission =
      permissions?.[resource] ??
      permissions?.['*'];

    if (!permission) {
      return {
        allowed: false,
        scope: Scope.OWN,
      };
    }

    return {
      allowed: permission.actions.includes(action),
      scope: permission.scope,
    };
  }
}