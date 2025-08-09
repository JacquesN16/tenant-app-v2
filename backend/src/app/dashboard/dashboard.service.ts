import { Injectable } from '@nestjs/common';
import { PropertyService } from '../property/property.service';
import { TenantService } from '../tenant/tenant.service';
import { UnitService } from '../unit/unit.service';
import { BillService } from '../bill/bill.service';
import { DatabaseService } from '../../database/database.service';
import { bills, tenants } from '../../database/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

@Injectable()
export class DashboardService {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly tenantService: TenantService,
    private readonly unitService: UnitService,
    private readonly billService: BillService,
    private readonly databaseService: DatabaseService,
  ) {}

  async getStats() {
    const properties = await this.propertyService.findAll();
    const allTenants = await this.tenantService.findAll();
    const units = await this.unitService.findAll();

    const occupiedUnits = units.filter((unit) => unit.isOccupied).length;
    const vacantUnits = units.length - occupiedUnits;
    const activeTenants = allTenants.filter((tenant) => tenant.isActive).length;
    const occupancyRate =
      units.length > 0 ? (occupiedUnits / units.length) * 100 : 0;

    // Revenue calculations
    const totalMonthlyRevenue = allTenants
      .filter((tenant) => tenant.isActive)
      .reduce(
        (sum, tenant) =>
          sum + (tenant.monthlyRent || 0) + (tenant.monthlyCharge || 0),
        0,
      );

    // Recent bills and payment stats
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const currentMonthBills = await this.databaseService
      .getDb()
      .select()
      .from(bills)
      .where(and(eq(bills.month, currentMonth), eq(bills.year, currentYear)));

    const outstandingBills = currentMonthBills.filter((bill) => !bill.isPaid);
    const outstandingAmount = outstandingBills.reduce(
      (sum, bill) => sum + bill.amount,
      0,
    );
    const collectionRate =
      currentMonthBills.length > 0
        ? ((currentMonthBills.length - outstandingBills.length) /
            currentMonthBills.length) *
          100
        : 100;

    // Recent activity - last 5 tenants
    const recentTenants = allTenants
      .sort(
        (a, b) =>
          new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(),
      )
      .slice(0, 5)
      .map((tenant) => ({
        id: tenant.id,
        name: `${tenant.firstName} ${tenant.lastName}`,
        entryDate: tenant.entryDate,
        monthlyRent: tenant.monthlyRent,
        isActive: tenant.isActive,
      }));

    // Lease expiration alerts (next 90 days)
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const upcomingLeaseExpirations = allTenants
      .filter(
        (tenant) =>
          tenant.isActive &&
          tenant.leaseEndDate &&
          new Date(tenant.leaseEndDate) <= threeMonthsFromNow &&
          new Date(tenant.leaseEndDate) >= new Date(),
      )
      .map((tenant) => ({
        id: tenant.id,
        name: `${tenant.firstName} ${tenant.lastName}`,
        leaseEndDate: tenant.leaseEndDate,
        daysUntilExpiry: Math.ceil(
          (new Date(tenant.leaseEndDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      }))
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    // Property type breakdown
    const propertyTypeBreakdown = properties.reduce((acc, property) => {
      const type = property.propertyType || 'UNKNOWN';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      // Basic stats
      totalProperties: properties.length,
      totalUnits: units.length,
      totalTenants: allTenants.length,
      activeTenants,
      unitStatus: {
        occupied: occupiedUnits,
        vacant: vacantUnits,
      },
      occupancyRate: Math.round(occupancyRate * 100) / 100,

      // Financial stats
      totalMonthlyRevenue,
      outstandingAmount,
      outstandingBillsCount: outstandingBills.length,
      collectionRate: Math.round(collectionRate * 100) / 100,

      // Recent activity
      recentTenants,
      upcomingLeaseExpirations,

      // Property insights
      propertyTypeBreakdown,
      avgUnitsPerProperty:
        properties.length > 0
          ? Math.round((units.length / properties.length) * 100) / 100
          : 0,
    };
  }
}
