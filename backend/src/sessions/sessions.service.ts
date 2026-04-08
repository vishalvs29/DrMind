import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.session.findMany({
            include: {
                steps: { orderBy: { order: 'asc' } },
                program: true
            }
        });
    }

    async findOne(id: string) {
        return this.prisma.session.findUnique({
            where: { id },
            include: {
                steps: { orderBy: { order: 'asc' } },
                program: true
            }
        });
    }

    async getResumeProgress(userId: string) {
        return this.prisma.userSessionProgress.findFirst({
            where: {
                userId,
                isCompleted: false
            },
            orderBy: { lastUpdated: 'desc' },
            include: { session: { include: { steps: { orderBy: { order: 'asc' } } } } }
        });
    }

    async updateProgress(userId: string, data: any) {
        const { sessionId, currentStepIndex, progressSeconds } = data;

        return this.prisma.userSessionProgress.upsert({
            where: { userId_sessionId: { userId, sessionId } },
            update: { currentStepIndex, progressSeconds },
            create: { userId, sessionId, currentStepIndex, progressSeconds }
        });
    }

    async completeStep(userId: string, sessionId: string, stepId: string) {
        const progress = await this.prisma.userSessionProgress.findUnique({
            where: { userId_sessionId: { userId, sessionId } }
        });

        const completedSteps = progress?.completedSteps || [];
        if (!completedSteps.includes(stepId)) {
            completedSteps.push(stepId);
        }

        return this.prisma.userSessionProgress.update({
            where: { userId_sessionId: { userId, sessionId } },
            data: { completedSteps }
        });
    }

    async completeSession(userId: string, sessionId: string) {
        return this.prisma.userSessionProgress.update({
            where: { userId_sessionId: { userId, sessionId } },
            data: { isCompleted: true }
        });
    }
}
