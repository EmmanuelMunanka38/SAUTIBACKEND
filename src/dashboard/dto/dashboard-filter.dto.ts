import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardFilterDto {
  @ApiPropertyOptional({ description: 'Filter dashboard by ward ID' })
  @IsOptional()
  @IsUUID()
  wardId?: string;
}
