import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Replies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('replies')
export class RepliesController {
  constructor(private repliesService: RepliesService) {}

  @Post()
  @ApiOperation({ summary: 'Reply to a complaint' })
  create(@Body() dto: CreateReplyDto, @CurrentUser() user: any) {
    return this.repliesService.create(dto, user.id, user.role);
  }

  @Get('complaint/:complaintId')
  @ApiOperation({ summary: 'Get all replies for a complaint' })
  findByComplaint(@Param('complaintId', ParseUUIDPipe) complaintId: string) {
    return this.repliesService.findByComplaint(complaintId);
  }
}
