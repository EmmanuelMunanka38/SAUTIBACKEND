import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ComplaintStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export class UpdateComplaintStatusDto {
  @ApiProperty({ enum: ComplaintStatusEnum })
  @IsEnum(ComplaintStatusEnum)
  status: ComplaintStatusEnum;
}
