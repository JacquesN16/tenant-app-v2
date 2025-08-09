import {
  pgTable,
  text,
  unique,
  real,
  integer,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  firstName: text('firstName'),
  lastName: text('lastName'),
  email: text('email').unique(),
  token: text('token'),
  phone: text('phone'),
  address: jsonb('address'),
  avatarUrl: text('avatarUrl'),
  propertyIds: jsonb('propertyIds'),
  language: text('language').default('en'),
  theme: text('theme').default('light'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  password: text('password'),
  resetPasswordToken: text('resetPasswordToken'),
  resetPasswordExpires: timestamp('resetPasswordExpires'),
});

export const properties = pgTable('properties', {
  id: text('id').primaryKey(),
  address: jsonb('address'),
  ownerId: text('ownerId').references(() => users.id),
  nickname: text('nickname'),
  propertyType: text('propertyType'),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const units = pgTable('units', {
  id: text('id').primaryKey(),
  unitNumber: text('unitNumber'),
  isOccupied: boolean('isOccupied'),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  squareFootage: integer('squareFootage'),
  tenantIds: jsonb('tenantIds'),
  propertyId: text('propertyId').references(() => properties.id),
});

export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  title: text('title'),
  firstName: text('firstName'),
  lastName: text('lastName'),
  phoneNumber: text('phoneNumber'),
  email: text('email'),
  monthlyRent: real('monthlyRent'),
  monthlyCharge: real('monthlyCharge'),
  unitId: text('unitId').references(() => units.id),
  entryDate: timestamp('entryDate'),
  isActive: boolean('isActive'),
  leaseStartDate: timestamp('leaseStartDate'),
  leaseEndDate: timestamp('leaseEndDate'),
  securityDeposit: real('securityDeposit'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const bills = pgTable('bills', {
  id: text('id').primaryKey(),
  tenantId: text('tenantId').references(() => tenants.id),
  amount: real('amount'),
  month: integer('month'),
  year: integer('year'),
  isPaid: boolean('isPaid'),
  dueDate: timestamp('dueDate'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});
