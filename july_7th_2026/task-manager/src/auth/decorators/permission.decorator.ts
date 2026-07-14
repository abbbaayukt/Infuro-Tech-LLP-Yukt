import { SetMetadata } from '@nestjs/common';
import { Resource } from '../../permissions/enums/resource.enum';
import { Action } from '../../permissions/enums/action.enum';

export const PERMISSION_KEY = 'permission';

export const Permission = (
  resource: Resource,
  action: Action,
) =>
  SetMetadata(PERMISSION_KEY, {
    resource,
    action,
  });