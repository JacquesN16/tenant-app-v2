import { Injectable, NotFoundException } from '@nestjs/common';
import { UnitEntity } from './unit.entity';
import { CreateUnitDto, UpdateUnitDto } from './unit.dto';
import { DatabaseService } from '../../database/database.service';
import { units, properties } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { PropertyEntity } from '../property/property.entity';

@Injectable()
export class UnitService {
  constructor(private databaseService: DatabaseService) {}

  async create(createUnitDto: CreateUnitDto): Promise<UnitEntity> {
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const [unit] = await this.databaseService
      .getDb()
      .insert(units)
      .values({ id, ...createUnitDto, propertyId: createUnitDto.property.id })
      .returning();
    return {
      ...unit,
      property: createUnitDto.property,
      tenantIds: unit.tenantIds as string[],
    };
  }

  async findAll(): Promise<UnitEntity[]> {
    const result = await this.databaseService
      .getDb()
      .select()
      .from(units)
      .leftJoin(properties, eq(units.propertyId, properties.id));
    return result.map((r) => ({
      ...r.units,
      property: r.properties as PropertyEntity,
      tenantIds: r.units.tenantIds as string[],
    }));
  }

  async findOne(id: string): Promise<UnitEntity> {
    const [result] = await this.databaseService
      .getDb()
      .select()
      .from(units)
      .leftJoin(properties, eq(units.propertyId, properties.id))
      .where(eq(units.id, id));

    if (!result) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return {
      ...result.units,
      property: result.properties as PropertyEntity,
      tenantIds: result.units.tenantIds as string[],
    };
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<UnitEntity> {
    const [updatedUnit] = await this.databaseService
      .getDb()
      .update(units)
      .set(updateUnitDto)
      .where(eq(units.id, id))
      .returning();

    if (!updatedUnit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    const [property] = await this.databaseService
      .getDb()
      .select()
      .from(properties)
      .where(eq(properties.id, updatedUnit.propertyId));

    return {
      ...updatedUnit,
      property: property as PropertyEntity,
      tenantIds: updatedUnit.tenantIds as string[],
    };
  }

  async remove(id: string): Promise<void> {
    const result = await this.databaseService
      .getDb()
      .delete(units)
      .where(eq(units.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
  }
}
