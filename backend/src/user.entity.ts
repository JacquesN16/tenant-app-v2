import { User as IUser, Address } from '@tenant-lib/model';

export class User implements IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  phone?: string;
  address?: Address;
  avatarUrl?: string;
  propertyIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}
