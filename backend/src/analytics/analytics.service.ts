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

    async calculateStreak(userId: string): Promise<number> {
        const [moodLogs, sessions] = await Promise.all([
            this.prisma.moodLog.findMany({
                where: { userId },
                select: { timestamp: true },
                orderBy: { timestamp: 'desc' },
                take: 100
            }),
            this.prisma.userSessionProgress.findMany({
                where: { userId, isCompleted: true },
                select: { lastUpdated: true },
                orderBy: { lastUpdated: 'desc' },
                take: 100
            })
        ]);

        const activityDates = new Set([
            ...moodLogs.map(log => log.timestamp.toISOString().split('T')[0]),
            ...sessions.map(s => s.lastUpdated.toISOString().split('T')[0])
        ]);

        const sortedDates = Array.from(activityDates).sort().reverse();
        if (sortedDates.length === 0) return 0;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // If no activity today or yesterday, streak is 0
        if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
            return 0;
        }

        let streak = 0;
        let expectedDate = new Date(sortedDates[0]);

        for (const dateStr of sortedDates) {
            const date = new Date(dateStr);
            const diffTime = expectedDate.getTime() - date.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0 || diffDays === 1) {
                streak++;
                expectedDate = date;
            } else {
                break;
            }
        }

        return streak;
    }

    async getEngagementMetrics(userId: string) {
        const [sessionsCount, streakDays] = await Promise.all([
            this.prisma.userSessionProgress.count({
                where: { userId, isCompleted: true }
            }),
            this.calculateStreak(userId)
        ]);

        return {
            completedSessions: sessionsCount,
            streakDays: streakDays,
        };
    }
}
