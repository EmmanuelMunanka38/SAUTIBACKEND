import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('statistics')
  @Roles(Role.MP, Role.ADMIN)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStatistics(@Query() filters: DashboardFilterDto) {
    return this.dashboardService.getStatistics(filters.wardId);
  }

  @Get('ward-analytics')
  @Roles(Role.MP, Role.ADMIN)
  @ApiOperation({ summary: 'Get complaints analytics by ward' })
  async getWardAnalytics() {
    return this.dashboardService.getWardAnalytics();
  }

  @Get('complaint-trends')
  @Roles(Role.MP, Role.ADMIN)
  @ApiOperation({ summary: 'Get complaint trends (last 30 days)' })
  async getComplaintTrends() {
    return this.dashboardService.getComplaintTrends();
  }

  @Get('recent-complaints')
  @Roles(Role.MP, Role.ADMIN)
  @ApiOperation({ summary: 'Get recent complaints' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecentComplaints(@Query('limit') limit?: string) {
    return this.dashboardService.getRecentComplaints(limit ? parseInt(limit, 10) : 5);
  }

  @Get('promise-analytics')
  @Roles(Role.MP, Role.ADMIN)
  @ApiOperation({ summary: 'Get promise progress analytics' })
  async getPromiseAnalytics() {
    return this.dashboardService.getPromiseProgressAnalytics();
  }
}
