import { IsArray, IsEnum } from 'class-validator';
import { Action } from '../../permissions/enums/action.enum';
import { Scope } from '../../permissions/enums/scope.enum';

export class PermissionDto {
  @IsArray()
  @IsEnum(Action, { each: true })
  actions!: Action[];

  @IsEnum(Scope)
  scope!: Scope;
}