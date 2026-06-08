import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ComplaintStatusEnum } from '../dto/update-complaint-status.dto';

export class ComplaintFilterDto {
  @ApiPropertyOptional({ description: 'Filter by ward ID' })
  @IsOptional()
  @IsUUID()
  wardId?: string;

  @ApiPropertyOptional({ enum: ComplaintStatusEnum })
  @IsOptional()
  @IsEnum(ComplaintStatusEnum)
  status?: ComplaintStatusEnum;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
