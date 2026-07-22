import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, Repository } from 'typeorm';
import { TenantContext } from '../context/tenant.context';

@Injectable()
export class TenantDatabaseService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly tenantContext: TenantContext,
  ) {}

  getRepository<T>(
    entity: EntityTarget<T>,
  ): Repository<T> {

    const schema = this.tenantContext.getSchema();

    console.log('Using schema:', schema);

    const repo = this.dataSource.getRepository(entity);

    repo.metadata.schema = schema;

    return repo;
  }
}