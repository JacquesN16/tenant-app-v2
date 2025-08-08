import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantEntity } from './tenant.entity';
import { CreateTenantDto, UpdateTenantDto } from './tenant.dto';
import { UnitService } from '../unit/unit.service';
import { DatabaseService } from '../../database/database.service';
import { tenants, units } from '../../database/schema';
import { eq } from 'drizzle-orm';
import {convertToDate} from "../../helper/utils";

@Injectable()
export class TenantService {
  constructor(
    private databaseService: DatabaseService,
    private readonly unitService: UnitService,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<TenantEntity> {
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Helper function to safely convert date strings to Date objects
    const convertToDate = (value: any): Date | undefined => {
      if (!value) return undefined;
      if (value instanceof Date) return value;
      if (typeof value === 'string') return new Date(value);
      return undefined;
    };

    // Convert date strings to Date objects
    const tenantData = {
      ...createTenantDto,
      entryDate: convertToDate(createTenantDto.entryDate) || new Date(),
      leaseStartDate: convertToDate(createTenantDto.leaseStartDate),
      leaseEndDate: convertToDate(createTenantDto.leaseEndDate),
    };

    const [tenant] = await this.databaseService
      .getDb()
      .insert(tenants)
      .values({ id, ...tenantData })
      .returning();

    const unit = await this.unitService.findOne(createTenantDto.unitId);
    if (unit) {
      const tenantIds = unit.tenantIds || [];
      tenantIds.push(tenant.id);
      await this.databaseService
        .getDb()
        .update(units)
        .set({ isOccupied: true, tenantIds })
        .where(eq(units.id, unit.id));
    }

    return tenant;
  }

  async findAll(): Promise<TenantEntity[]> {
    return this.databaseService.getDb().select().from(tenants);
  }

  async findOne(id: string): Promise<TenantEntity> {
    const [tenant] = await this.databaseService
      .getDb()
      .select()
      .from(tenants)
      .where(eq(tenants.id, id));

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async update(
    id: string,
    updateTenantDto: UpdateTenantDto,
  ): Promise<TenantEntity> {
    const tenantData = {
      ...updateTenantDto,
      ...(updateTenantDto.entryDate && {
        entryDate: convertToDate(updateTenantDto.entryDate),
      }),
      ...(updateTenantDto.leaseStartDate && {
        leaseStartDate: convertToDate(updateTenantDto.leaseStartDate),
      }),
      ...(updateTenantDto.leaseEndDate && {
        leaseEndDate: convertToDate(updateTenantDto.leaseEndDate),
      }),
      ...(updateTenantDto.createdAt && {
        createdAt: convertToDate(updateTenantDto.createdAt),
      }),
      ...(updateTenantDto.updatedAt && {
        updatedAt: convertToDate(updateTenantDto.updatedAt),
      }),
    };

    const [updatedTenant] = await this.databaseService
      .getDb()
      .update(tenants)
      .set(tenantData)
      .where(eq(tenants.id, id))
      .returning();

    if (!updatedTenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return updatedTenant;
  }

  async remove(id: string): Promise<void> {
    const result = await this.databaseService
      .getDb()
      .delete(tenants)
      .where(eq(tenants.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
  }
}
