import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromiseDto } from './dto/create-promise.dto';
import { UpdatePromiseProgressDto } from './dto/update-promise-progress.dto';

@Injectable()
export class PromisesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePromiseDto) {
    return this.prisma.promise.create({
      data: {
        ...dto,
        progressPercentage: dto.progressPercentage || 0,
        status: (dto.status || 'NOT_STARTED') as any,
      },
    });
  }

  async findAll() {
    return this.prisma.promise.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const promise = await this.prisma.promise.findUnique({ where: { id } });
    if (!promise) {
      throw new NotFoundException('Promise not found');
    }
    return promise;
  }

  async updateProgress(id: string, dto: UpdatePromiseProgressDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.progressPercentage !== undefined) data.progressPercentage = dto.progressPercentage;
    if (dto.status) data.status = dto.status;

    if (data.progressPercentage === 100) {
      data.status = 'COMPLETED';
    }

    return this.prisma.promise.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.promise.delete({ where: { id } });
  }
}
