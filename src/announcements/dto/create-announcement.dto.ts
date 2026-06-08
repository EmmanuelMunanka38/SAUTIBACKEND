import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Town Hall Meeting', description: 'Announcement title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'There will be a town hall meeting on Friday...', description: 'Announcement content' })
  @IsString()
  content: string;
}
