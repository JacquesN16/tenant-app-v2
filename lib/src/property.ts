

import { Address } from './user.js';

export enum PropertyType {
  APARTMENT_BUILDING = 'APARTMENT_BUILDING',
  SINGLE_FAMILY_HOME = 'SINGLE_FAMILY_HOME',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  DUPLEX = 'DUPLEX',
  SHARE_HOUSE = 'SHARE_HOUSE',
}

export type Unit = {
  id: string;
  unitNumber: string;
  isOccupied: boolean;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number; // Floor area in square meters (m²)
  tenantIds?: string[]; // To link to a list of Tenants
  property?: Property;
};

export type Property = {
  // Required fields
  id: string;
  address: Address;
  units: Unit[];
  ownerId: string; // Link to the User (owner)

  // Optional fields
  nickname?: string;
  propertyType?: PropertyType;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
