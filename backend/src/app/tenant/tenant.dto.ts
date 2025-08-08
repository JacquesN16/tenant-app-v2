import { PartialType } from '@nestjs/mapped-types';
import { TenantEntity } from './tenant.entity';

export class CreateTenantDto extends PartialType(TenantEntity) {}

export class UpdateTenantDto extends PartialType(TenantEntity) {}
