import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/CreateTenantDto';
import { TenantSchemaService } from './tenant-schema.service';
import { CacheService } from 'src/common/cache/cache.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly tenantSchemaService: TenantSchemaService,
    private readonly dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) {}

  async create(dto: CreateTenantDto) {
    const tenant = this.tenantRepository.create({
        name: dto.displayName,
    });

    const savedTenant =
        await this.tenantRepository.save(tenant);

    const schemaName =
        `tenant_${savedTenant.id.replace(/-/g, '_')}`;

    savedTenant.schemaName = schemaName;

    await this.tenantRepository.save(savedTenant);

    await this.tenantSchemaService.createSchema(
        schemaName,
    );

    await this.tenantSchemaService.createTables(
        schemaName,
    );

    await this.cacheService.setTenant(
        savedTenant.id,
        {
        schema: schemaName,
        },
    );

    return savedTenant;
    }

  async findAll() {
    return this.tenantRepository.find();
  }

  async findOne(id: string) {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async findById(id: string) {
    return await this.tenantRepository.findOne({
      where: { id },
    });
  }

  async findByName(name: string) {
    return await this.tenantRepository.findOne({
      where: { name },
    });
  }
}