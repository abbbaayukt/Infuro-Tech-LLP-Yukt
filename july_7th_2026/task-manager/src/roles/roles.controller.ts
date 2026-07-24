import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Permission } from '../permissions/decorators/permission.decorator';
import { Resource } from '../permissions/enums/resource.enum';
import { Action } from '../permissions/enums/action.enum';
import { ApiExtraModels } from '@nestjs/swagger';
import { PermissionDto } from './dto/permission.dto';

@ApiExtraModels(PermissionDto)
@UseGuards(JwtAuthGuard,PermissionGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  @Permission({ resource: Resource.ROLES, action: Action.READ })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permission({ resource: Resource.ROLES, action: Action.READ })
  findOne(
    @Param('id') id: string,
  ) {
    return this.rolesService.findById(id);
  }

  @Post()
  @Permission({ resource: Resource.ROLES, action: Action.CREATE })
  create(
    @Body() dto: CreateRoleDto,
  ) {
    return this.rolesService.create(dto);
  }

  @Patch(':id')
  @Permission({ resource: Resource.ROLES, action: Action.UPDATE })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rolesService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permission({ resource: Resource.ROLES, action: Action.DELETE })
  remove(
    @Param('id') id: string,
  ) {
    return this.rolesService.delete(id);
  }
}