import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../permissions.service';
import { PERMISSION_KEY } from '../../auth/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const permission = this.reflector.get(
      PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permission) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const userId = request.user.userId;

    const hasPermission =
      await this.permissionsService.hasPermission(
        userId,
        permission.resource,
        permission.action,
      );

    if (!hasPermission) {
      throw new ForbiddenException(
        'Permission denied',
      );
    }

    request.user.scope =
      await this.permissionsService.getScope(
        userId,
        permission.resource,
      );

    return true;
  }
}