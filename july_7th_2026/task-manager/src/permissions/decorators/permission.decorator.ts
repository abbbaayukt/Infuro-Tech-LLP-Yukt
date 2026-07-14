import { SetMetadata } from '@nestjs/common';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

export const PERMISSION_KEY = 'permission';

export const Permission = (
  resource: Resource,
  action: Action,
) =>
  SetMetadata(PERMISSION_KEY, {
    resource,
    action,
  });