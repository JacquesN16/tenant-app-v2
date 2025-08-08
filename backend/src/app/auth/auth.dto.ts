import { PickType } from '@nestjs/mapped-types';
import { User } from '../../user.entity';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto extends PickType(User, [
  'firstName',
  'lastName',
  'email',
  'password',
]) {}

export class LogInDto extends PickType(User, ['email', 'password']) {}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
