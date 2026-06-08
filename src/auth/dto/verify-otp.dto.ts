import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '+255712345678', description: 'Phone number with country code' })
  @IsString()
  @Matches(/^\+255\d{9}$/, { message: 'Phone number must be a valid Tanzanian number (+255xxxxxxxxx)' })
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: 'OTP code sent to phone' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'OTP must be a 6-digit code' })
  code: string;
}
