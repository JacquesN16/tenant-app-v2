import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  SignUpDto,
  LogInDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './auth.dto';
import { randomBytes, pbkdf2 } from 'crypto';
import { promisify } from 'util';
import { DatabaseService } from '../../database/database.service';
import { users } from '../../database/schema';
import { eq } from 'drizzle-orm';

const randomBytesAsync = promisify(randomBytes);
const pbkdf2Async = promisify(pbkdf2);

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const { firstName, lastName, email, password } = signUpDto;

    const [existingUser] = await this.databaseService
      .getDb()
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    await this.databaseService.getDb().insert(users).values({
      id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      token: '',
    });

    return { message: 'User registered successfully' };
  }

  async logIn(logInDto: LogInDto): Promise<{ accessToken: string }> {
    const { email, password } = logInDto;
    const [user] = await this.databaseService
      .getDb()
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    await this.databaseService
      .getDb()
      .update(users)
      .set({ token: accessToken })
      .where(eq(users.id, user.id));

    return { accessToken };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const [user] = await this.databaseService
      .getDb()
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      throw new NotFoundException('User with that email does not exist.');
    }

    const resetToken = (await randomBytesAsync(32)).toString('hex');
    const hashedToken = (
      await pbkdf2Async(resetToken, 'salt', 100000, 64, 'sha512')
    ).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000);

    await this.databaseService
      .getDb()
      .update(users)
      .set({ resetPasswordToken: hashedToken, resetPasswordExpires })
      .where(eq(users.id, user.id));

    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { message: 'Password reset email sent.' };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;

    const hashedToken = (
      await pbkdf2Async(token, 'salt', 100000, 64, 'sha512')
    ).toString('hex');

    const [user] = await this.databaseService
      .getDb()
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, hashedToken));

    if (!user || new Date(user.resetPasswordExpires) < new Date()) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.databaseService
      .getDb()
      .update(users)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .where(eq(users.id, user.id));

    return { message: 'Password has been reset.' };
  }
}
