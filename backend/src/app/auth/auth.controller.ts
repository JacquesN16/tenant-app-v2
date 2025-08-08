import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  LogInDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ message: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  logIn(@Body() logInDto: LogInDto): Promise<{ accessToken: string }> {
    return this.authService.logIn(logInDto);
  }

  @Post('forgot-password')
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
