import { Injectable } from '@nestjs/common';

export type EmotionType = 'ANXIETY' | 'STRESS' | 'SADNESS' | 'ANGER' | 'LONELINESS' | 'HOPELESSNESS' | 'NEUTRAL';
export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface EmotionResult {
    emotion: EmotionType;
    intensity: number; // 0-1
    sentiment: SentimentType;
}

const EMOTION_PATTERNS: Record<EmotionType, string[]> = {
    ANXIETY: ['anxious', 'panic', 'scared', 'worry', 'breathless', 'shaking', 'nervous', 'racing heart'],
    STRESS: ['stress', 'overwhelmed', 'too much', 'exhausted', 'busy', 'pressure', 'burnout'],
    SADNESS: ['sad', 'crying', 'unhappy', 'miss', 'hurt', 'pain', 'heartbroken', 'miserable'],
    ANGER: ['angry', 'mad', 'hate', 'furious', 'annoyed', 'pissed', 'frustrated'],
    LONELINESS: ['lonely', 'alone', 'no one', 'isolated', 'ignored', 'empty'],
    HOPELESSNESS: ['hopeless', 'pointless', 'no future', 'disappear', 'give up', 'done with this'],
    NEUTRAL: []
};

@Injectable()
export class EmotionService {
    analyzeEmotion(input: string): EmotionResult {
        const text = input.toLowerCase();
        let detectedEmotion: EmotionType = 'NEUTRAL';
        let maxMatches = 0;

        // Find dominant emotion
        for (const [emotion, patterns] of Object.entries(EMOTION_PATTERNS)) {
            const matchCount = patterns.filter(p => text.includes(p)).length;
            if (matchCount > maxMatches) {
                maxMatches = matchCount;
                detectedEmotion = emotion as EmotionType;
            }
        }

        // Calculate intensity based on match count and specific "strong" keywords
        let intensity = Math.min(0.2 + (maxMatches * 0.2), 1.0);

        // Boost intensity for strong markers
        if (text.includes('very') || text.includes('really') || text.includes('extremely') || text.includes('!')) {
            intensity = Math.min(intensity + 0.2, 1.0);
        }

        // Determine sentiment
        let sentiment: SentimentType = 'NEUTRAL';
        if (detectedEmotion !== 'NEUTRAL') {
            sentiment = 'NEGATIVE';
        } else if (text.includes('good') || text.includes('better') || text.includes('happy')) {
            sentiment = 'POSITIVE';
        }

        return {
            emotion: detectedEmotion,
            intensity,
            sentiment
        };
    }
}
