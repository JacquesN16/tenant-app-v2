import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './user.dto';
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
}
