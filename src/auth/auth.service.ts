import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { OtpService } from './otp.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private configService: ConfigService,
  ) {}

  async requestOtp(phoneNumber: string): Promise<{ message: string }> {
    const code = await this.otpService.generateOtp(phoneNumber);
    // In production, integrate with an SMS provider (e.g., Africa's Talking, Twilio)
    // For development, the code is returned directly
    return { message: `OTP sent to ${phoneNumber}` };
  }

  async verifyOtp(
    phoneNumber: string,
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    await this.otpService.verifyOtp(phoneNumber, code);

    let user = await this.prisma.user.findUnique({ where: { phoneNumber } });

    if (!user) {
      throw new BadRequestException('User not found. Please register first.');
    }

    if (!user.isVerified) {
      await this.prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
    }

    const tokens = await this.generateTokens(user.id, user.phoneNumber, user.role);

    return { ...tokens, user };
  }

  async register(
    fullName: string,
    phoneNumber: string,
    role: string,
    wardId: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const existingUser = await this.prisma.user.findUnique({ where: { phoneNumber } });

    if (existingUser) {
      throw new BadRequestException('User with this phone number already exists');
    }

    const ward = await this.prisma.ward.findUnique({ where: { id: wardId } });
    if (!ward) {
      throw new BadRequestException('Ward not found');
    }

    const user = await this.prisma.user.create({
      data: { fullName, phoneNumber, role: role as any, wardId, isVerified: true },
    });

    const tokens = await this.generateTokens(user.id, user.phoneNumber, user.role);

    return { ...tokens, user };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: { token: refreshToken, expiresAt: { gte: new Date() } },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    return this.generateTokens(storedToken.user.id, storedToken.user.phoneNumber, storedToken.user.role);
  }

  private async generateTokens(
    userId: string,
    phoneNumber: string,
    role: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, phoneNumber, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
    });

    const refreshTokenValue = uuidv4();
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: { token: refreshTokenValue, expiresAt: refreshTokenExpiresAt },
      create: { userId, token: refreshTokenValue, expiresAt: refreshTokenExpiresAt },
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
