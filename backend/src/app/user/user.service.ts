import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { users } from '../../database/schema';
import { UpdateUserDto } from './user.dto';
import { eq } from 'drizzle-orm';
import { User } from 'src/user.entity';
import { Address } from '@tenant-lib/model';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async findById(id: string): Promise<Omit<User, 'password'>> {
    const [user] = await this.databaseService
      .getDb()
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, resetPasswordToken, resetPasswordExpires, ...result } =
      user;
    return {
      ...result,
      address: result.address as Address,
      propertyIds: result.propertyIds as string[],
    };
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const [user] = await this.databaseService
      .getDb()
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.databaseService
      .getDb()
      .update(users)
      .set(updateUserDto)
      .where(eq(users.id, id))
      .returning();

    const { password, resetPasswordToken, resetPasswordExpires, ...result } =
      updatedUser[0];
    return {
      ...result,
      address: result.address as Address,
      propertyIds: result.propertyIds as string[],
    };
  }
}
