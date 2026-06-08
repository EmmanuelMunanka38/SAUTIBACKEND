import { IsString, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty({ example: 'Broken water pipe in Mabatini', description: 'Complaint title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'The water pipe on Maji Street has been broken for a week...', description: 'Detailed description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Water', description: 'Category (e.g., Water, Roads, Health, Education, Sanitation)' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Ward ID where the issue is located' })
  @IsUUID()
  wardId: string;
}
