export interface Bill {
  id: string;
  tenantId: string;
  amount: number;
  month: number;
  year: number;
  isPaid: boolean;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
