import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RiskLevel } from '@prisma/client';

const RISK_PATTERNS = {
    CRITICAL: [
        'kill myself', 'suicide', 'end my life', 'better off dead',
        'hurt myself', 'taking my own life', 'cut my wrists', 'swallow pills'
    ],
    HIGH: [
        'want to disappear', 'no reason to live', 'end everything',
        'hate my life', 'can\u0027t keep going', 'give up', 'hopeless'
    ],
    MEDIUM: [
        'anxious', 'stress', 'lonely', 'sad', 'crying', 'depressed',
        'can\u0027t sleep', 'overwhelmed'
    ]
};

@Injectable()
export class CrisisService {
    constructor(private prisma: PrismaService) { }

    async detectRisk(input: string): Promise<{ level: RiskLevel; score: number }> {
        const text = input.toLowerCase();

        // Critical (Level 4)
        if (RISK_PATTERNS.CRITICAL.some(pattern => text.includes(pattern))) {
            return { level: RiskLevel.CRITICAL, score: 95 };
        }

        // High (Level 3)
        if (RISK_PATTERNS.HIGH.some(pattern => text.includes(pattern))) {
            return { level: RiskLevel.HIGH, score: 75 };
        }

        // Medium (Level 2)
        if (RISK_PATTERNS.MEDIUM.some(pattern => text.includes(pattern))) {
            return { level: RiskLevel.MEDIUM, score: 45 };
        }

        // Low (Level 1)
        return { level: RiskLevel.LOW, score: 10 };
    }

    async logCrisisEvent(userId: string, level: RiskLevel, phrase: string) {
        return this.prisma.crisisEvent.create({
            data: {
                userId,
                riskLevel: level,
                detectionPhrase: phrase.substring(0, 255)
            }
        });
    }

    async getHelplines(country: string = 'IN') {
        return this.prisma.emergencyHelpline.findMany({
            where: { country: country.toUpperCase() }
        });
    }

    async seedInitialHelplines() {
        const count = await this.prisma.emergencyHelpline.count();
        if (count > 0) return;

        await this.prisma.emergencyHelpline.createMany({
            data: [
                { country: 'IN', name: 'AASRA', phone: '+91-9820466726', description: '24/7 Suicide Prevention' },
                { country: 'IN', name: 'Kiran', phone: '1800-599-0019', description: 'Mental Health Rehab Helpline' },
                { country: 'US', name: '988 Lifeline', phone: '988', description: 'Suicide \u0026 Crisis Lifeline' },
                { country: 'UK', name: 'Samaritans', phone: '116 123', description: 'Available day and night' },
            ]
        });
    }
}
