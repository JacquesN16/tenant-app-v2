import { Injectable } from '@nestjs/common';
import { BillEntity } from './bill.entity';
import { DatabaseService } from '../../database/database.service';
import { tenants, bills } from '../../database/schema';
import { Cron } from '@nestjs/schedule';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class BillService {
  constructor(private databaseService: DatabaseService) {}

  @Cron('0 12 28-31 * *')
  async generateMonthlyBills(): Promise<void> {
    const activeTenants = await this.databaseService
      .getDb()
      .select()
      .from(tenants)
      .where(eq(tenants.isActive, true));
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();

    if (today.getDate() !== lastDayOfMonth) {
      console.log('Not the last day of the month. Skipping bill generation.');
      return;
    }

    for (const tenant of activeTenants) {
      let amountDue = tenant.monthlyRent + tenant.monthlyCharge;

      const [existingBill] = await this.databaseService
        .getDb()
        .select()
        .from(bills)
        .where(
          and(
            eq(bills.tenantId, tenant.id),
            eq(bills.month, currentMonth),
            eq(bills.year, currentYear),
          ),
        );

      if (existingBill) {
        console.log(
          `Bill for tenant ${tenant.id} for ${currentMonth}/${currentYear} already exists. Skipping.`,
        );
        continue;
      }

      const tenantEntryDate = new Date(tenant.entryDate);
      if (
        tenantEntryDate.getMonth() + 1 === currentMonth &&
        tenantEntryDate.getFullYear() === currentYear
      ) {
        const entryDay = tenantEntryDate.getDate();
        if (entryDay > 1) {
          const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
          const remainingDays = daysInMonth - entryDay + 1;
          amountDue = (amountDue / daysInMonth) * remainingDays;
          console.log(
            `Prorating bill for tenant ${tenant.id}. Original amount: ${
              tenant.monthlyRent + tenant.monthlyCharge
            }, Prorated amount: ${amountDue}`,
          );
        }
      }

      const dueDate = new Date(currentYear, currentMonth, 5);
      const id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      await this.databaseService.getDb().insert(bills).values({
        id,
        tenantId: tenant.id,
        amount: amountDue,
        month: currentMonth,
        year: currentYear,
        isPaid: false,
        dueDate,
      });

      console.log(
        `Generated bill for tenant ${tenant.id} for ${currentMonth}/${currentYear} with amount ${amountDue}`,
      );
    }
  }

  async getBillsByTenant(tenantId: string): Promise<BillEntity[]> {
    const result = await this.databaseService
      .getDb()
      .select()
      .from(bills)
      .leftJoin(tenants, eq(bills.tenantId, tenants.id))
      .where(eq(bills.tenantId, tenantId));
    return result.map((r) => ({ ...r.bills, tenant: r.tenants }));
  }

  async getBillById(id: string): Promise<BillEntity> {
    const [result] = await this.databaseService
      .getDb()
      .select()
      .from(bills)
      .leftJoin(tenants, eq(bills.tenantId, tenants.id))
      .where(eq(bills.id, id));
    return { ...result.bills, tenant: result.tenants };
  }

  async markBillAsPaid(id: string): Promise<BillEntity> {
    const [bill] = await this.databaseService
      .getDb()
      .update(bills)
      .set({ isPaid: true })
      .where(eq(bills.id, id))
      .returning();
    const [tenant] = await this.databaseService
      .getDb()
      .select()
      .from(tenants)
      .where(eq(tenants.id, bill.tenantId));
    return { ...bill, tenant };
  }
}
