import {
  Property as IProperty,
  Address,
  PropertyType,
  Unit,
} from '@tenant-lib/model';

export class PropertyEntity implements IProperty {
  id: string;
  address: Address;
  units: Unit[];
  ownerId: string;
  nickname?: string;
  propertyType?: PropertyType;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
