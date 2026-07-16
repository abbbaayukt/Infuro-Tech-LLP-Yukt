import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

export interface PermissionRequirement {
  resource: Resource;
  action: Action;
}