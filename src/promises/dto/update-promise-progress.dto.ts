import { IsInt, IsEnum, Min, Max, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PromiseStatusEnum } from './create-promise.dto';

export class UpdatePromiseProgressDto {
  @ApiPropertyOptional({ description: 'Progress percentage (0-100)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercentage?: number;

  @ApiPropertyOptional({ enum: PromiseStatusEnum })
  @IsOptional()
  @IsEnum(PromiseStatusEnum)
  status?: PromiseStatusEnum;
}
