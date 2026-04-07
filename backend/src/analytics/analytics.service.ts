import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getMoodTrends(userId: string) {
        return this.prisma.moodLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: 7
        });
    }

    async calculateStressScore(userId: string) {
        const logs = await this.prisma.moodLog.findMany({
            where: { userId },
            take: 10,
            orderBy: { timestamp: 'desc' }
        });

        if (logs.length === 0) return 0;

        // Simple average stress calculation (inverted mood level)
        const avgMood = logs.reduce((sum, log) => sum + log.level, 0) / logs.length;
        return Math.round((5 - avgMood) * 20); // Scale 0-100
    }

    async getEngagementMetrics(userId: string) {
        const sessions = await this.prisma.userProgress.count({
            where: { userId, completed: true }
        });

        return {
            completedSessions: sessions,
            streakDays: 5, // Mock streak for now
        };
    }
}
