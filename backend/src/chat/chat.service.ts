import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ChatService {
    constructor(
        private prisma: PrismaService,
        private aiService: AiService
    ) { }

    async processMessage(userId: string, text: string) {
        // Log user message
        await this.prisma.chatHistory.create({
            data: { userId, message: text, sender: 'user' }
        });

        // Check for crisis
        const intents = await this.aiService.detectIntents(text);
        if (intents.includes('CRISIS')) {
            await this.prisma.crisisLog.create({
                data: { userId, messageText: text, detection: 'SUICIDE_IDEATION' }
            });

            const crisisResp = "I'm concerned about what you're saying. Please know that you're not alone. If you're in immediate danger, please call 988 or reach out to emergency services.";

            await this.prisma.chatHistory.create({
                data: { userId, message: crisisResp, sender: 'ai' }
            });

            return { text: crisisResp, isCrisis: true };
        }

        // Generate AI response
        const aiResponse = await this.aiService.generateResponse(text);

        // Log AI response
        await this.prisma.chatHistory.create({
            data: { userId, message: aiResponse, sender: 'ai' }
        });

        return { text: aiResponse, isCrisis: false };
    }

    async getHistory(userId: string) {
        return this.prisma.chatHistory.findMany({
            where: { userId },
            orderBy: { timestamp: 'asc' },
            take: 50
        });
    }
}
