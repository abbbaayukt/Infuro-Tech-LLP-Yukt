import { Module } from '@nestjs/common';
import { TenantDatabaseService } from './tenant-database.service';
import { ContextModule } from '../context/context.module';

@Module({
  imports: [ContextModule],
  providers: [TenantDatabaseService],
  exports: [TenantDatabaseService],
})
export class DatabaseModule {}