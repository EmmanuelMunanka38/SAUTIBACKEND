import { IsString, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PromiseStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export class CreatePromiseDto {
  @ApiProperty({ example: 'Build new market in Iganjo', description: 'Promise title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'I promise to build a modern market in Iganjo ward within my term.', description: 'Promise description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Infrastructure', description: 'Category' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercentage?: number;

  @ApiPropertyOptional({ enum: PromiseStatusEnum, default: PromiseStatusEnum.NOT_STARTED })
  @IsOptional()
  @IsEnum(PromiseStatusEnum)
  status?: PromiseStatusEnum;
}
