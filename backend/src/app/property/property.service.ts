import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyEntity } from './property.entity';
import { CreatePropertyDto, UpdatePropertyDto } from './property.dto';
import { DatabaseService } from '../../database/database.service';
import { properties, units, tenants } from '../../database/schema';
import { eq, inArray } from 'drizzle-orm';
import { Address, PropertyType, Unit } from '@tenant-lib/model';

@Injectable()
export class PropertyService {
  constructor(private databaseService: DatabaseService) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<PropertyEntity> {
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const [property] = await this.databaseService
      .getDb()
      .insert(properties)
      .values({ id, ...createPropertyDto })
      .returning();
    return {
      ...property,
      units: [],
      address: property.address as Address,
      propertyType: property.propertyType as PropertyType,
    };
  }

  async findAll(): Promise<PropertyEntity[]> {
    const result = await this.databaseService.getDb().select().from(properties);
    const allUnits = await this.databaseService.getDb().select().from(units);

    return result.map((p) => ({
      ...p,
      units: allUnits.filter((u) => u.propertyId === p.id) as unknown as Unit[],
      address: p.address as Address,
      propertyType: p.propertyType as PropertyType,
    }));
  }

  async findOne(id: string): Promise<PropertyEntity> {
    const [property] = await this.databaseService
      .getDb()
      .select()
      .from(properties)
      .where(eq(properties.id, id));

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    const propertyUnits = await this.databaseService
      .getDb()
      .select()
      .from(units)
      .where(eq(units.propertyId, id));

    return {
      ...property,
      units: propertyUnits as unknown as Unit[],
      address: property.address as Address,
      propertyType: property.propertyType as PropertyType,
    };
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<PropertyEntity> {
    const [updatedProperty] = await this.databaseService
      .getDb()
      .update(properties)
      .set(updatePropertyDto)
      .where(eq(properties.id, id))
      .returning();

    if (!updatedProperty) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    const propertyUnits = await this.databaseService
      .getDb()
      .select()
      .from(units)
      .where(eq(units.propertyId, id));

    return {
      ...updatedProperty,
      units: propertyUnits as unknown as Unit[],
      address: updatedProperty.address as Address,
      propertyType: updatedProperty.propertyType as PropertyType,
    };
  }

  async remove(id: string): Promise<void> {
    const property = await this.findOne(id);
    const unitIds = property.units.map((unit) => unit.id);

    if (unitIds.length > 0) {
      const tenantIds = (
        await this.databaseService
          .getDb()
          .select({ id: tenants.id })
          .from(tenants)
          .where(inArray(tenants.unitId, unitIds))
      ).map((t) => t.id);

      if (tenantIds.length > 0) {
        await this.databaseService
          .getDb()
          .delete(tenants)
          .where(inArray(tenants.id, tenantIds));
      }

      await this.databaseService
        .getDb()
        .delete(units)
        .where(inArray(units.id, unitIds));
    }

    const result = await this.databaseService
      .getDb()
      .delete(properties)
      .where(eq(properties.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }
}
