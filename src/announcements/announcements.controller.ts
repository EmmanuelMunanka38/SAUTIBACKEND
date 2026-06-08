import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MP, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an announcement (MP/Admin only)' })
  create(@Body() dto: CreateAnnouncementDto, @CurrentUser('id') userId: string) {
    return this.announcementsService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all announcements (Public)' })
  findAll() {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get announcement by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MP, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update announcement (MP/Admin only)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MP, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete announcement (MP/Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.remove(id);
  }
}
