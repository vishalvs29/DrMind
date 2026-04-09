import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RiskLevel } from '@prisma/client';

@Processor('risk-detection')
@Injectable()
export class RiskProcessor extends WorkerHost {
    constructor(private prisma: PrismaService) {
        super()
    }

    async process(job: Job<{ userId?: string }, any, string>): Promise<any> {
        const { userId } = job.data;

        // Route to the correct handler based on job type
        if (job.name === 'global-risk-scan') {
            return this.runGlobalRiskScan();
        }

        if (userId) {
            return this.runUserRiskAssessment(userId);
        }

        return { status: 'skipped', reason: 'No valid job type or userId provided' };
    }

    /**
     * Per-user risk assessment triggered when a user interacts with the system.
     * Evaluates recent mood logs and unresolved crisis events.
     */
    private async runUserRiskAssessment(userId: string): Promise<any> {
        console.log(`Processing automated risk detection for user: ${userId}`);

        // 1. Get recent mood logs (last 5)
        const recentMoods = await this.prisma.moodLog.findMany({
            where: { userId },
            take: 5,
            orderBy: { timestamp: 'desc' }
        });

        // 2. Check for unresolved crisis events
        const recentCrisis = await this.prisma.crisisEvent.findFirst({
            where: { userId, resolved: false },
            orderBy: { timestamp: 'desc' }
        });

        let riskScore = 0;
        let riskLevel: RiskLevel = RiskLevel.LOW;

        // Logic A: Consecutive low mood (<= 2)
        const lowMoodCount = recentMoods.filter(m => m.level <= 2).length;
        if (lowMoodCount >= 3) {
            riskScore += 40;
        } else if (lowMoodCount >= 1) {
            riskScore += 10;
        }

        // Logic B: Most recent entry is critically low (level 1)
        if (recentMoods.length > 0 && recentMoods[0].level === 1) {
            riskScore += 30;
        }

        // Logic C: Unresolved crisis history
        if (recentCrisis) {
            riskScore += 50;
        }

        // Determine Risk Level based on score
        if (riskScore >= 80) riskLevel = RiskLevel.CRITICAL;
        else if (riskScore >= 50) riskLevel = RiskLevel.HIGH;
        else if (riskScore >= 20) riskLevel = RiskLevel.MEDIUM;

        // 3. Persist the Risk Score
        await this.prisma.riskScore.create({
            data: { userId, score: riskScore, level: riskLevel }
        });

        // 4. Create a CrisisEvent if CRITICAL and no open crisis exists
        if (riskLevel === RiskLevel.CRITICAL && !recentCrisis) {
            await this.prisma.crisisEvent.create({
                data: {
                    userId,
                    riskLevel: RiskLevel.CRITICAL,
                    detectionPhrase: 'Automated Score Threshold Exceeded',
                    resolved: false
                }
            });
            console.warn(`Critical risk detected for user ${userId}. Created CrisisEvent.`);
        }

        return { status: 'completed', riskLevel, riskScore };
    }

    /**
     * Global scan: proactively identifies users who haven't checked in for 3+ days
     * with an average mood below 3. For each, creates a HIGH risk score record.
     * Intended to be enqueued as a scheduled job (e.g. daily via a cron-based queue producer).
     */
    private async runGlobalRiskScan(): Promise<any> {
        console.log('Starting global at-risk user scan...');

        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

        // Find users whose most recent mood log is older than 3 days
        // (i.e., no check-in in the last 3 days)
        const inactiveUsers = await this.prisma.moodLog.groupBy({
            by: ['userId'],
            _max: { timestamp: true },
            _avg: { level: true },
            having: {
                timestamp: { _max: { lt: threeDaysAgo } }
            }
        });

        const atRiskUsers = inactiveUsers.filter(
            u => (u._avg.level ?? 5) < 3
        );

        console.log(`Global scan found ${atRiskUsers.length} at-risk inactive users.`);

        let flagged = 0;
        for (const u of atRiskUsers) {
            // Avoid duplicate HIGH risk records for the same period
            const existingRecent = await this.prisma.riskScore.findFirst({
                where: {
                    userId: u.userId,
                    timestamp: { gte: threeDaysAgo }
                }
            });

            if (existingRecent) continue;

            await this.prisma.riskScore.create({
                data: {
                    userId: u.userId,
                    score: 60,
                    level: RiskLevel.HIGH
                }
            });
            flagged++;
            console.warn(
                `[GlobalScan] User ${u.userId} has not checked in for 3+ days with avg mood ${u._avg.level?.toFixed(1)}. Risk level: HIGH.`
            );
        }

        return {
            status: 'completed',
            scanned: inactiveUsers.length,
            flagged
        };
    }
}
