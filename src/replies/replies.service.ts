import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class RepliesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReplyDto, senderId: string, senderRole: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id: dto.complaintId },
      include: { user: true },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    const user = await this.prisma.user.findUnique({ where: { id: senderId } });

    if (senderRole === Role.CITIZEN && complaint.userId !== senderId) {
      throw new ForbiddenException('You can only reply to your own complaints');
    }

    return this.prisma.reply.create({
      data: { complaintId: dto.complaintId, senderId, message: dto.message },
      include: { sender: { select: { id: true, fullName: true, role: true } } },
    });
  }

  async findByComplaint(complaintId: string) {
    const complaint = await this.prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return this.prisma.reply.findMany({
      where: { complaintId },
      include: { sender: { select: { id: true, fullName: true, role: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
