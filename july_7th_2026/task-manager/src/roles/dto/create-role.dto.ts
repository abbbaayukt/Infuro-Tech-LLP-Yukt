import { IsObject, IsOptional, IsString } from 'class-validator';
import { PermissionDto } from './permission.dto';

export class CreateRoleDto {

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  permissions?: Record<string, PermissionDto>;
}