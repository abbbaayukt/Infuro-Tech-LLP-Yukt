import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../permissions.service';
import { PERMISSION_KEY } from '../../permissions/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const permissions = this.reflector.get(
      PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permissions || permissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    for (const permission of permissions) {
      const result =
        await this.permissionsService.validatePermission(
          user.roleId,
          permission.resource,
          permission.action,
        );

      if (result.allowed) {
        request.user.scope = result.scope;
        return true;
      }
    }

    throw new ForbiddenException('Permission denied');
  }
}