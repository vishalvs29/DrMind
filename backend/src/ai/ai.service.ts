import { Injectable } from '@nestjs/common';
import { EmotionAnalyzerService, AnalysisResult as EmotionResult } from './emotion-analyzer.service';

interface ContextItem {
    message: string;
    sender: 'user' | 'ai';
    emotion: EmotionResult;
    timestamp: Date;
}

@Injectable()
export class AiService {
    private contexts: Map<string, ContextItem[]> = new Map();
    private readonly MAX_CONTEXT_SIZE = 10;

    constructor(private analyzer: EmotionAnalyzerService) { }

    async processInput(userId: string, input: string): Promise<{ response: string; emotion: EmotionResult }> {
        const emotionResult = this.analyzer.analyze(input);

        // Add to context
        this.updateContext(userId, input, 'user', emotionResult);

        // Analyze trend
        const trend = this.analyzeTrend(userId);

        // Generate response based on current emotion and trend
        const responseText = this.generateTherapyResponse(emotionResult, trend);

        // Add response to context
        this.updateContext(userId, responseText, 'ai', { emotion: 'NEUTRAL', intensity: 0, level: 'low', sentiment: 'NEUTRAL' });

        return {
            response: responseText,
            emotion: emotionResult
        };
    }

    private updateContext(userId: string, message: string, sender: 'user' | 'ai', emotion: EmotionResult) {
        const userContext = this.contexts.get(userId) || [];
        userContext.push({ message, sender, emotion, timestamp: new Date() });

        if (userContext.length > this.MAX_CONTEXT_SIZE) {
            userContext.shift();
        }

        this.contexts.set(userId, userContext);
    }

    private analyzeTrend(userId: string): { status: 'STABLE' | 'DECLINING' | 'IMPROVING' } {
        const context = this.contexts.get(userId) || [];
        const negativeEmotions = ['SADNESS', 'HOPELESSNESS', 'ANGER', 'ANXIETY', 'STRESS'];

        if (context.length < 3) return { status: 'STABLE' };

        const userMessages = context.filter(c => c.sender === 'user');
        if (userMessages.length < 2) return { status: 'STABLE' };

        const recent = userMessages.slice(-3);
        const negativeCount = recent.filter(r => negativeEmotions.includes(r.emotion.emotion)).length;

        if (negativeCount >= 2) return { status: 'DECLINING' };
        return { status: 'STABLE' };
    }

    private generateTherapyResponse(current: EmotionResult, trend: any): string {
        if (current.emotion === 'HOPELESSNESS' || (current.emotion === 'SADNESS' && current.intensity > 0.8)) {
            return "I'm really sorry you're feeling this way. It sounds incredibly painful. Please know you don't have to carry this alone. I'm here to listen, and there are human professionals who care deeply about your safety too.";
        }

        if (current.emotion === 'ANXIETY' || current.emotion === 'STRESS') {
            const intensityMsg = current.intensity > 0.6 ? "It sounds like you're feeling very overwhelmed." : "It sounds like things are a bit much right now.";
            return `${intensityMsg} Would you like to try a 2-minute grounding exercise or just talk through what's on your mind?`;
        }

        if (current.emotion === 'ANGER') {
            return "It's completely valid to feel angry right now. Thank you for being honest about it. What do you feel is the biggest source of this frustration?";
        }

        if (trend.status === 'DECLINING') {
            return "I've noticed you've been having a really tough time lately. I want you to know I'm here for you. Is there something specific that happened today that made things feel heavier?";
        }

        if (current.sentiment === 'POSITIVE') {
            return "It's wonderful to hear things are feeling a bit brighter. What was the best part of your day?";
        }

        return "I'm here to listen. Tell me more about how you're feeling.";
    }
}
