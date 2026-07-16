import { SetMetadata } from '@nestjs/common';
import { PermissionRequirement } from '../../permissions/interfaces/permission.interface';

export const PERMISSION_KEY = 'permission';

export const Permission = (
  ...permissions: PermissionRequirement[]
) =>
  SetMetadata(
    PERMISSION_KEY,
    permissions,
  );