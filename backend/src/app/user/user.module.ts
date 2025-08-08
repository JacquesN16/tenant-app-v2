import { Module } from '@nestjs/common';
import * as process from 'node:process';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
