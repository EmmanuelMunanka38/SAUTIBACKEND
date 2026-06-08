import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics(wardId?: string) {
    const whereFilter = wardId ? { wardId } : {};

    const [totalComplaints, pendingComplaints, inProgressComplaints, resolvedComplaints, totalAnnouncements, totalPromises] =
      await Promise.all([
        this.prisma.complaint.count({ where: whereFilter }),
        this.prisma.complaint.count({ where: { ...whereFilter, status: 'PENDING' } }),
        this.prisma.complaint.count({ where: { ...whereFilter, status: 'IN_PROGRESS' } }),
        this.prisma.complaint.count({ where: { ...whereFilter, status: 'RESOLVED' } }),
        this.prisma.announcement.count(),
        this.prisma.promise.count(),
      ]);

    return {
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      totalAnnouncements,
      totalPromises,
      resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0,
    };
  }

  async getWardAnalytics() {
    const wards = await this.prisma.ward.findMany({
      include: {
        _count: { select: { complaints: true, users: true } },
      },
      orderBy: { name: 'asc' },
    });

    return wards.map((ward) => ({
      id: ward.id,
      name: ward.name,
      constituency: ward.constituency,
      totalComplaints: ward._count.complaints,
      totalUsers: ward._count.users,
    }));
  }

  async getComplaintTrends() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const complaints = await this.prisma.complaint.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true, status: true, category: true },
    });

    const trendsByDate = complaints.reduce(
      (acc, complaint) => {
        const date = complaint.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, total: 0, PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0 };
        }
        acc[date].total++;
        acc[date][complaint.status]++;
        return acc;
      },
      {} as Record<string, any>,
    );

    const categoryBreakdown = complaints.reduce(
      (acc, complaint) => {
        if (!acc[complaint.category]) {
          acc[complaint.category] = { category: complaint.category, count: 0 };
        }
        acc[complaint.category].count++;
        return acc;
      },
      {} as Record<string, any>,
    );

    return {
      dailyTrends: Object.values(trendsByDate),
      categoryBreakdown: Object.values(categoryBreakdown),
    };
  }

  async getRecentComplaints(limit = 5) {
    return this.prisma.complaint.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, fullName: true } },
        ward: { select: { id: true, name: true } },
      },
    });
  }

  async getPromiseProgressAnalytics() {
    const promises = await this.prisma.promise.findMany();

    return {
      total: promises.length,
      notStarted: promises.filter((p) => p.status === 'NOT_STARTED').length,
      ongoing: promises.filter((p) => p.status === 'ONGOING').length,
      completed: promises.filter((p) => p.status === 'COMPLETED').length,
      averageProgress: promises.length > 0
        ? Math.round(promises.reduce((sum, p) => sum + p.progressPercentage, 0) / promises.length)
        : 0,
      byCategory: promises.reduce(
        (acc, p) => {
          if (!acc[p.category]) acc[p.category] = { category: p.category, total: 0, averageProgress: 0 };
          acc[p.category].total++;
          acc[p.category].averageProgress += p.progressPercentage;
          return acc;
        },
        {} as Record<string, any>,
      ),
    };
  }
}
