import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMoodDto } from './dto/create-mood.dto';

@Injectable()
export class MoodService {
    constructor(private prisma: PrismaService) { }

    async logMood(userId: string, dto: CreateMoodDto) {
        return this.prisma.moodLog.create({
            data: {
                userId,
                level: dto.level,
                note: dto.note
            }
        });
    }

    async getHistory(userId: string) {
        return this.prisma.moodLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: 7
        });
    }
}
