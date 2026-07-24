import { IsArray, IsEnum } from 'class-validator';
import { Action } from '../../permissions/enums/action.enum';
import { Scope } from '../../permissions/enums/scope.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {

  @ApiProperty({
    enum: Action,
    isArray: true,
    example: ['CREATE', 'READ'],
  })
  @IsArray()
  @IsEnum(Action, { each: true })
  actions!: Action[];

  @ApiProperty({
    enum: Scope,
    example: Scope.OWN,
  })
  @IsEnum(Scope)
  scope!: Scope;
}