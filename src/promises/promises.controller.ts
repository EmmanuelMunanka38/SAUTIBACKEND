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
import { PromisesService } from './promises.service';
import { CreatePromiseDto } from './dto/create-promise.dto';
import { UpdatePromiseProgressDto } from './dto/update-promise-progress.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Promises')
@Controller('promises')
export class PromisesController {
  constructor(private promisesService: PromisesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MP, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new promise (MP/Admin only)' })
  create(@Body() dto: CreatePromiseDto) {
    return this.promisesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all promises (Public)' })
  findAll() {
    return this.promisesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promise by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.promisesService.findOne(id);
  }

  @Patch(':id/progress')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MP, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update promise progress (MP/Admin only)' })
  updateProgress(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePromiseProgressDto) {
    return this.promisesService.updateProgress(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MP, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete promise (MP/Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.promisesService.remove(id);
  }
}
