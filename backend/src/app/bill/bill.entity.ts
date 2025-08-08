import { TenantEntity } from '../tenant/tenant.entity';

export class BillEntity {
  id: string;
  tenantId: string;
  tenant: TenantEntity;
  amount: number;
  month: number;
  year: number;
  isPaid: boolean;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
