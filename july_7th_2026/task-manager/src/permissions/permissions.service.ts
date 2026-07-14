import { Injectable, NotFoundException } from '@nestjs/common';
import { Resource } from './enums/resource.enum';
import { Action } from './enums/action.enum';
import { PermissionState } from './enums/permission-state.enum';
import { Scope } from './enums/scope.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user-entity';
@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ) {}

  private getPermission(
    permissions: Record<string, any> | undefined,
    resource: string,
    action: string,
  ): PermissionState | undefined {
    return (
      permissions?.[resource]?.[action] ??
      permissions?.['*']?.[action]
    );
  }

  private resolvePermission(
    rolePermission: PermissionState | undefined,
    overridePermission: PermissionState | undefined,
  ): boolean {

    if (
      overridePermission &&
      overridePermission !== PermissionState.INHERIT
    ) {
      return overridePermission === PermissionState.ALLOW;
    }

    if (
      rolePermission &&
      rolePermission !== PermissionState.INHERIT
    ) {
      return rolePermission === PermissionState.ALLOW;
    }

    return false;
  }

  async hasPermission(
    userId: number,
    resource: Resource,
    action: Action,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: {
            role: true,
        },
        });

        if (!user) {
        throw new NotFoundException('User not found');
        }

    const rolePermission = this.getPermission(
      user.role.permissions,
      resource,
      action,
    );

    const overridePermission = this.getPermission(
      user.permissionOverride,
      resource,
      action,
    );

    return this.resolvePermission(
      rolePermission,
      overridePermission,
    );
  }

  async getScope(
    userId: number,
    resource: Resource,
    ): Promise<Scope> {

    const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: {
            role: true,
        },
    });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    const roleScope =
        user.role.permissions?.[resource]?.scope ??
        user.role.permissions?.['*']?.scope;

    const overrideScope =
        user.permissionOverride?.[resource]?.scope ??
        user.permissionOverride?.['*']?.scope;

    if (overrideScope) {
        return overrideScope;
    }

    if (roleScope) {
        return roleScope;
    }

    return Scope.OWN;
    }
}