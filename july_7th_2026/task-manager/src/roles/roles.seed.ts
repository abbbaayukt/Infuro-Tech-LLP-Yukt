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
            "actions": ["create", "read", "update", "delete"],
            "scope": "all",
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
            "actions": ["create", "read", "update"],
            "scope": "own",
            },
            users: {
            "actions": ["read"],
            "scope": "own",
            },
            roles: {
            "actions": ["read"],
            "scope": "own",
            },
        },
        });
    }
    }
}