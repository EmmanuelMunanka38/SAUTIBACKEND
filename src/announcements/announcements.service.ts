import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnnouncementDto, publishedBy: string) {
    return this.prisma.announcement.create({
      data: { ...dto, publishedBy },
      include: { publisher: { select: { id: true, fullName: true } } },
    });
  }

  async findAll() {
    return this.prisma.announcement.findMany({
      include: { publisher: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: { publisher: { select: { id: true, fullName: true } } },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    await this.findOne(id);
    return this.prisma.announcement.update({
      where: { id },
      data: dto,
      include: { publisher: { select: { id: true, fullName: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.announcement.delete({ where: { id } });
  }
}
