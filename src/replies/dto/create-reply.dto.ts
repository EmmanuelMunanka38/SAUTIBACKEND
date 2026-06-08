import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty({ description: 'Complaint ID to reply to' })
  @IsUUID()
  complaintId: string;

  @ApiProperty({ example: 'We have received your complaint and will address it shortly.', description: 'Reply message' })
  @IsString()
  message: string;
}
