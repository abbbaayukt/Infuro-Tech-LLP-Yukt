import { Controller, Get, Delete, Param, UseGuards, Patch, Body, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Action } from '../permissions/enums/action.enum';
import { Resource } from '../permissions/enums/resource.enum';
import { Permission } from '../permissions/decorators/permission.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Permission({ resource: Resource.USERS, action: Action.READ })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permission({ resource: Resource.USERS, action: Action.READ })
  findOne(
    @Param('id') id: string,
  ) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @Permission({ resource: Resource.USERS, action: Action.DELETE })
  remove(
    @Param('id') id: string,
  ) {
    return this.usersService.delete(id);
  }

  @Patch(':id/role')
  @Permission({ resource: Resource.USERS, action: Action.UPDATE })
  changeRole(
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
  ) {
    return this.usersService.changeRole(
      id,
      dto.roleId,
    );
  }
}