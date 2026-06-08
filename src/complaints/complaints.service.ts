import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { ComplaintFilterDto } from './filters/complaint-filter.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateComplaintDto, userId: string) {
    const ward = await this.prisma.ward.findUnique({ where: { id: dto.wardId } });
    if (!ward) {
      throw new NotFoundException('Ward not found');
    }

    return this.prisma.complaint.create({
      data: { ...dto, userId },
      include: { user: { select: { id: true, fullName: true, phoneNumber: true } }, ward: true },
    });
  }

  async findAll(filters: ComplaintFilterDto) {
    const where: any = {};

    if (filters.wardId) where.wardId = filters.wardId;
    if (filters.status) where.status = filters.status;
    if (filters.category) where.category = filters.category;
    if (filters.userId) where.userId = filters.userId;

    return this.prisma.complaint.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true, phoneNumber: true } },
        ward: true,
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, phoneNumber: true } },
        ward: true,
        replies: {
          include: { sender: { select: { id: true, fullName: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return complaint;
  }

  async updateStatus(id: string, dto: UpdateComplaintStatusDto, userId: string, userRole: string) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    if (userRole !== Role.ADMIN && userRole !== Role.MP) {
      throw new ForbiddenException('Only MP or Admin can update complaint status');
    }

    return this.prisma.complaint.update({
      where: { id },
      data: { status: dto.status as any },
      include: { user: true, ward: true },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    if (complaint.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own complaints');
    }

    return this.prisma.complaint.delete({ where: { id } });
  }
}
