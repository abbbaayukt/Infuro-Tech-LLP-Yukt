import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { User } from 'src/users/entities/user-entity';
import { PermissionGuard } from './guards/permission.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    PermissionsService,
    PermissionGuard,
  ],
  exports: [
    PermissionsService,
    PermissionGuard,
  ],
})
export class PermissionsModule {}