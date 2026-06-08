import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user profile' })
  create(@Body() dto: CreateProfileDto) {
    return this.profilesService.create(dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get profile by user ID' })
  findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.profilesService.findOne(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update profile by user ID' })
  update(@Param('userId', ParseUUIDPipe) userId: string, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(userId, dto);
  }
}
