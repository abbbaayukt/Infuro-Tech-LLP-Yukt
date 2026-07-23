import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { CacheService } from '../../common/cache/cache.service';
import { TenantContext } from '../../common/context/tenant.context';
import { TenantsService } from '../tenants.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly cacheService: CacheService,
    private readonly tenantContext: TenantContext,
    private readonly tenantsService: TenantsService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest();

    const tenantId = request.user.tenantId;

    const cachedTenant =
      await this.cacheService.getTenant(
        tenantId,
      );

    let schema: string;

    if (cachedTenant) {
      schema = cachedTenant.schema;
    } else {
      const tenant =
        await this.tenantsService.findById(
          tenantId,
        );

      if (!tenant) {
        throw new NotFoundException(
          'Tenant not found',
        );
      }

      schema = tenant.schemaName;

      await this.cacheService.setTenant(
        tenant.id,
        {
          schema,
        },
      );
    }

    this.tenantContext.setSchema(schema);

    console.log(
      this.tenantContext.getSchema(),
    );

    return true;
  }
}