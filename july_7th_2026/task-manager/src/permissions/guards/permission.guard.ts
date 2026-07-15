import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../../auth/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const permission = this.reflector.get(
      PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const permissionData =
      user.permissions?.[permission.resource] ??
      user.permissions?.['*'];

    if (!permissionData) {
      throw new ForbiddenException('Permission denied');
    }

    const hasPermission =
      permissionData.actions.includes(permission.action);

    if (!hasPermission) {
      throw new ForbiddenException('Permission denied');
    }

    request.user.scope = permissionData.scope;

    return true;
  }
}