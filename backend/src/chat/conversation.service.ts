import { Injectable } from '@nestjs/common';
import { EmotionAnalyzerService } from '../ai/emotion-analyzer.service';
import { ResponseService } from '../ai/response.service';
import { audioMap } from '../ai/audioMap';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConversationService {
    constructor(
        private analyzer: EmotionAnalyzerService,
        private responder: ResponseService,
        private prisma: PrismaService
    ) { }

    async processInput(userId: string, input: string) {
        // Log user message
        await this.prisma.chatHistory.create({
            data: { userId, message: input, sender: 'user' }
        });

        const analysis = this.analyzer.analyze(input);
        const response = this.responder.getResponse(analysis.emotion, analysis.level);

        // Map audio tag to external URL
        const audioUrl = response.audio_tag ? audioMap[response.audio_tag] : null;

        // Log AI response
        await this.prisma.chatHistory.create({
            data: { userId, message: response.text, sender: 'ai' }
        });

        // Crisis logging
        if (response.action === 'force_crisis_ui' || (analysis.emotion === 'HOPELESSNESS' && analysis.intensity > 0.7)) {
            await this.prisma.crisisEvent.create({
                data: {
                    userId,
                    riskLevel: 'CRITICAL',
                    detectionPhrase: input,
                    resolved: false
                }
            });
        }

        return {
            message: response.text,
            action: response.action,
            audio: audioUrl,
            emotion: analysis.emotion,
            intensity: analysis.intensity,
            sentiment: analysis.sentiment
        };
    }

    async getHistory(userId: string) {
        return this.prisma.chatHistory.findMany({
            where: { userId },
            orderBy: { timestamp: 'asc' },
            take: 50
        });
    }
}
