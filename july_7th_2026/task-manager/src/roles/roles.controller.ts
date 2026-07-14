import { Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Permission } from '../auth/decorators/permission.decorator';
import { Resource } from '../permissions/enums/resource.enum';
import { Action } from '../permissions/enums/action.enum';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  @Permission(Resource.ROLES, Action.READ)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permission(Resource.ROLES, Action.READ)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rolesService.findById(id);
  }

  @Post()
  @Permission(Resource.ROLES, Action.CREATE)
  create(
    @Body() dto: CreateRoleDto,
  ) {
    return this.rolesService.create(dto);
  }

  @Patch(':id')
  @Permission(Resource.ROLES, Action.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rolesService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permission(Resource.ROLES, Action.DELETE)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rolesService.delete(id);
  }
}