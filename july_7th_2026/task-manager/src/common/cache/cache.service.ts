import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  private getKey(roleId: string) {
    return `permission:role:${roleId}`;
  }

  async getRolePermissions(
    roleId: string,
    ): Promise<Record<string, any> | undefined>  {
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
}