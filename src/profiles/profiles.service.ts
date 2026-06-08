import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.prisma.profile.findUnique({ where: { userId: dto.userId } });
    if (existing) {
      throw new NotFoundException('Profile already exists for this user');
    }

    return this.prisma.profile.create({ data: dto });
  }

  async findOne(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { user: { select: { id: true, fullName: true, phoneNumber: true, role: true } } },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(userId: string, dto: UpdateProfileDto) {
    await this.findOne(userId);
    return this.prisma.profile.update({ where: { userId }, data: dto });
  }
}
