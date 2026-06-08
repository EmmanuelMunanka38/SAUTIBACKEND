import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { ComplaintFilterDto } from './filters/complaint-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Complaints')
@Controller('complaints')
export class ComplaintsController {
  constructor(private complaintsService: ComplaintsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new complaint' })
  create(@Body() dto: CreateComplaintDto, @CurrentUser() user: any) {
    return this.complaintsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all complaints (with optional filters)' })
  findAll(@Query() filters: ComplaintFilterDto) {
    return this.complaintsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get complaint by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.complaintsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MP, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update complaint status (MP/Admin only)' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateComplaintStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.complaintsService.updateStatus(id, dto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete complaint (owner or Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.complaintsService.remove(id, user.id, user.role);
  }
}
