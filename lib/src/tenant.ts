export type Tenant = {
  // Required fields
  id: string; // A unique identifier is highly recommended
  firstName: string;
  lastName: string;
  monthlyRent: number;
  monthlyCharge: number; // For additional charges like utilities, parking, etc.
  unitId: string;

  entryDate: Date;
  isActive: boolean;

  // Optional fields
  title?: string;
  phoneNumber?: string;
  email?: string;
  leaseStartDate?: Date;
  leaseEndDate?: Date;
  securityDeposit?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
