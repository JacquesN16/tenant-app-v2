import { Unit as IUnit } from '@tenant-lib/model';
import { PropertyEntity } from '../property/property.entity';

export class UnitEntity implements IUnit {
  id: string;
  unitNumber: string;
  isOccupied: boolean;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  tenantIds?: string[];
  property: PropertyEntity;
}
