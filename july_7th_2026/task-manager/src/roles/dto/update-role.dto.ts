import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  permissions?: Record<string, any>;
}