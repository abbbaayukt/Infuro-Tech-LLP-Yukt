import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './CreateTenantDto';

export class UpdateTenantDto extends PartialType(
  CreateTenantDto,
) {}