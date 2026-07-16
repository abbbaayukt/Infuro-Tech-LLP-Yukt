import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionGuard } from './guards/permission.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { AppCacheModule } from '../common/cache/cache.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    AppCacheModule,
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