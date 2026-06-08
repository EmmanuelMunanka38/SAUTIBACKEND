import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private readonly otpLength: number;
  private readonly otpExpirationMinutes: number;

  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.otpLength = configService.get<number>('OTP_LENGTH', 6);
    this.otpExpirationMinutes = configService.get<number>('OTP_EXPIRATION_MINUTES', 5);
  }

  async generateOtp(phoneNumber: string): Promise<string> {
    const code = Array.from({ length: this.otpLength }, () => crypto.randomInt(0, 9)).join('');

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.otpExpirationMinutes);

    await this.prisma.otp.create({
      data: { phoneNumber, code, expiresAt, verified: false },
    });

    return code;
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<boolean> {
    const otp = await this.prisma.otp.findFirst({
      where: { phoneNumber, code, verified: false, expiresAt: { gte: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.otp.update({ where: { id: otp.id }, data: { verified: true } });

    return true;
  }
}
