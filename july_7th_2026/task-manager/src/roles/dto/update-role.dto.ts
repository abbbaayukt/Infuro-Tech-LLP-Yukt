import { IsObject, IsOptional, IsString } from 'class-validator';
import { PermissionDto } from './permission.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    example: {
      users: {
        actions: ["CREATE", "READ", "UPDATE", "DELETE"],
        scope: "ALL"
      },
      tasks: {
        actions: ["READ", "UPDATE"],
        scope: "OWN"
      }
    }
  })
  @IsOptional()
  @IsObject()
  permissions?: Record<string, PermissionDto>;
}