import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProgramsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.program.findMany({
            include: { sessions: true }
        });
    }

    async getProgramWithUserProgress(userId: string, programId: string) {
        const program = await this.prisma.program.findUnique({
            where: { id: programId },
            include: { sessions: true }
        });

        if (!program) throw new NotFoundException('Program not found');

        const progress = await this.prisma.userProgress.findMany({
            where: { userId, sessionId: { in: program.sessions.map(s => s.id) } }
        });

        // Map progress to sessions to determine lock status
        const sessionsWithProgress = program.sessions.map((session, index) => {
            const sessionProgress = progress.find(p => p.sessionId === session.id);

            // A session is unlocked if it's the first one OR if the previous one is completed
            let isLocked = index > 0;
            if (index > 0) {
                const prevSession = program.sessions[index - 1];
                const prevProgress = progress.find(p => p.sessionId === prevSession.id);
                isLocked = !prevProgress?.completed;
            }

            return {
                ...session,
                isCompleted: sessionProgress?.completed || false,
                isLocked,
            };
        });

        return { ...program, sessions: sessionsWithProgress };
    }

    async updateProgress(userId: string, sessionId: string, completed: boolean, progressSec: number) {
        return this.prisma.userProgress.upsert({
            where: {
                userId_sessionId: { userId, sessionId }
            },
            update: { completed, progressSec, lastAccessed: new Date() },
            create: { userId, sessionId, completed, progressSec }
        });
    }
}
