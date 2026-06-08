import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWardDto {
  @ApiProperty({ example: 'Iganjo', description: 'Ward name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Mbeya Town', default: 'Mbeya Town' })
  @IsOptional()
  @IsString()
  constituency?: string;
}
