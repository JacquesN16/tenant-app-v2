import { Tenant as ITenant } from '@tenant-lib/model';

export class TenantEntity implements ITenant {
  id: string;
  title?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  monthlyRent: number;
  monthlyCharge: number;
  unitId: string;
  entryDate: Date;
  isActive: boolean;
  leaseStartDate?: Date;
  leaseEndDate?: Date;
  securityDeposit?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
