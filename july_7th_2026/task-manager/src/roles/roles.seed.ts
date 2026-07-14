import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolesService } from './roles.service';

@Injectable()
export class RolesSeed implements OnModuleInit {
  constructor(
    private readonly rolesService: RolesService,
  ) {}

  async onModuleInit() {
    const admin = await this.rolesService.findByName('ADMIN');

    if (!admin) {
        await this.rolesService.create({
        name: 'ADMIN',
        description: 'System Administrator',
        permissions: {
            '*': {
            create: 'allow',
            read: 'allow',
            update: 'allow',
            delete: 'allow',
            scope: 'all',
            },
        },
        });
    }

    const user = await this.rolesService.findByName('USER');

    if (!user) {
        await this.rolesService.create({
        name: 'USER',
        description: 'Regular User',
        permissions: {
            tasks: {
            create: 'allow',
            read: 'allow',
            update: 'allow',
            delete: 'deny',
            scope: 'own',
            },
            users: {
            create: 'deny',
            read: 'deny',
            update: 'deny',
            delete: 'deny',
            scope: 'own',
            },
            roles: {
            create: 'deny',
            read: 'deny',
            update: 'deny',
            delete: 'deny',
            scope: 'own',
            },
        },
        });
    }
    }
}