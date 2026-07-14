import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  permissions?: Record<string, any>;
}