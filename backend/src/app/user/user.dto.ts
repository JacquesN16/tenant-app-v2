import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Address } from '@tenant-lib/model';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsOptional()
  address?: Address;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
