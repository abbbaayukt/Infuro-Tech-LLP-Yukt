import { Injectable, NotFoundException } from '@nestjs/common';
import { Resource } from './enums/resource.enum';
import { Action } from './enums/action.enum';
import { PermissionState } from './enums/permission-state.enum';
import { Scope } from './enums/scope.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user-entity';
@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ) {}
  }