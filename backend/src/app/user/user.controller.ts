import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto, UpdateUserPreferencesDto } from './user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../../user.entity';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req): Promise<Omit<User, 'password'>> {
    const userId = req.user.id;
    return this.userService.findById(userId);
  }

  @Put('profile')
  async updateProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const userId = req.user.id;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Put('preferences')
  async updatePreferences(
    @Req() req,
    @Body() updateUserPreferencesDto: UpdateUserPreferencesDto,
  ): Promise<Omit<User, 'password'>> {
    const userId = req.user.id;
    return this.userService.updateUserPreferences(
      userId,
      updateUserPreferencesDto,
    );
  }
}
