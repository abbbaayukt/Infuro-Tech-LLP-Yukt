import { IsInt } from 'class-validator';

export class ChangeRoleDto {
  @IsInt()
  roleId!: number;
}