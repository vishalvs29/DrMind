import { Injectable } from '@nestjs/common';

export type IntensityLevel = 'low' | 'medium' | 'high';
export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface AnalysisResult {
    emotion: string;
    intensity: number;
    level: IntensityLevel;
    sentiment: SentimentType;
}

const PATTERNS = {
    ANXIETY: ['anxious', 'panic', 'scared', 'worry', 'breathless', 'shaking', 'nervous', 'racing heart', 'heart is racing', 'panic attack'],
    SADNESS: ['sad', 'crying', 'unhappy', 'miss', 'hurt', 'pain', 'heartbroken', 'miserable'],
    STRESS: ['stress', 'overwhelmed', 'too much', 'exhausted', 'busy', 'pressure', 'burnout'],
    ANGER: ['angry', 'mad', 'hate', 'furious', 'annoyed', 'pissed', 'frustrated'],
    LONELINESS: ['lonely', 'alone', 'no one', 'isolated', 'ignored', 'empty'],
    HOPELESSNESS: ['hopeless', 'pointless', 'no future', 'disappear', 'give up', 'done with this'],
    CRISIS: ['kill myself', 'suicide', 'end it']
};

@Injectable()
export class EmotionAnalyzerService {
    analyze(input: string): AnalysisResult {
        const text = input.toLowerCase();
        let detectedEmotion = 'NEUTRAL';
        let maxMatches = 0;

        for (const [emotion, patterns] of Object.entries(PATTERNS)) {
            const matchCount = patterns.filter(p => text.includes(p)).length;
            if (matchCount > maxMatches) {
                maxMatches = matchCount;
                detectedEmotion = emotion;
            }
        }

        // Crisis detection override
        if (PATTERNS.CRISIS.some(p => text.includes(p)) || detectedEmotion === 'HOPELESSNESS') {
            if (PATTERNS.CRISIS.some(p => text.includes(p))) {
                detectedEmotion = 'CRISIS';
            }
        }

        let intensity = Math.min(0.2 + (maxMatches * 0.2), 1.0);
        if (text.includes('very') || text.includes('really') || text.includes('extremely') || text.includes('!')) {
            intensity = Math.min(intensity + 0.2, 1.0);
        }

        let level: IntensityLevel = 'low';
        if (intensity > 0.7) level = 'high';
        else if (intensity > 0.3) level = 'medium';

        let sentiment: SentimentType = 'NEUTRAL';
        if (detectedEmotion !== 'NEUTRAL') {
            sentiment = 'NEGATIVE';
        } else if (text.includes('good') || text.includes('better') || text.includes('happy')) {
            sentiment = 'POSITIVE';
        }

        return { emotion: detectedEmotion, intensity, level, sentiment };
    }
}
