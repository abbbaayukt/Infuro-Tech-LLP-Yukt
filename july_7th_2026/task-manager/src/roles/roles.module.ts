import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesSeed } from './roles.seed';
import { PermissionsModule } from '../permissions/permissions.module';
import { AppCacheModule } from '../common/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]), PermissionsModule, AppCacheModule,
  ],
  providers: [RolesService, RolesSeed],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
