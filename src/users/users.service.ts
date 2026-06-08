import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { phoneNumber: dto.phoneNumber } });
    if (existing) {
      throw new BadRequestException('User with this phone number already exists');
    }

    const ward = await this.prisma.ward.findUnique({ where: { id: dto.wardId } });
    if (!ward) {
      throw new NotFoundException('Ward not found');
    }

    return this.prisma.user.create({ data: dto });
  }

  async findAll() {
    return this.prisma.user.findMany({ include: { ward: true, profile: true } });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { ward: true, profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
