import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Injectable()
export class WardsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWardDto) {
    return this.prisma.ward.create({ data: { ...dto, constituency: dto.constituency || 'Mbeya Town' } });
  }

  async findAll() {
    return this.prisma.ward.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const ward = await this.prisma.ward.findUnique({ where: { id } });
    if (!ward) {
      throw new NotFoundException('Ward not found');
    }
    return ward;
  }

  async update(id: string, dto: UpdateWardDto) {
    await this.findOne(id);
    return this.prisma.ward.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ward.delete({ where: { id } });
  }
}
