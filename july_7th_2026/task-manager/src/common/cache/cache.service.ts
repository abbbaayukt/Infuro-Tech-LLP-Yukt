import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

export interface TenantCache {
  schema: string;
}

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private getKey(roleId: string) {
    return `permission:role:${roleId}`;
  }

  private getTenantKey(
    tenantId: string,
  ) {
    return `tenant:${tenantId}`;
  }

  async getRolePermissions(
    roleId: string,
  ): Promise<Record<string, any> | undefined> {
    return await this.cacheManager.get<Record<string, any>>(
      this.getKey(roleId),
    );
  }

  async setRolePermissions(
    roleId: string,
    permissions: Record<string, any>,
  ) {
    await this.cacheManager.set(
      this.getKey(roleId),
      permissions,
    );
  }

  async deleteRolePermissions(roleId: string) {
    await this.cacheManager.del(
      this.getKey(roleId),
    );
  }

  async getTenant(
    tenantId: string,
  ): Promise<TenantCache | undefined> {
    return await this.cacheManager.get<TenantCache>(
      this.getTenantKey(tenantId),
    );
  }

  async setTenant(
    tenantId: string,
    value: TenantCache,
  ) {
    await this.cacheManager.set(
      this.getTenantKey(tenantId),
      value,
    );
  }

  async deleteTenant(
    tenantId: string,
  ) {
    await this.cacheManager.del(
      this.getTenantKey(tenantId),
    );
  }
}