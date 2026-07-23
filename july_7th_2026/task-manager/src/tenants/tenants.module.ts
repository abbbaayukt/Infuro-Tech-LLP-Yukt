import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantSchemaService } from './tenant-schema.service';
import { TenantGuard } from './guards/tenant.guard';
import { AppCacheModule } from './../common/cache/cache.module';
import { ContextModule } from './../common/context/context.module';
@Module({
  imports: [ TypeOrmModule.forFeature([Tenant]), AppCacheModule, ContextModule],
  controllers: [TenantsController],
  providers: [TenantsService, TenantSchemaService, TenantGuard],
  exports: [ TenantGuard, TenantsService ]
})
export class TenantsModule {}
