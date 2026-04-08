import { Injectable } from '@nestjs/common';

export type IntensityLevel = 'low' | 'medium' | 'high';

export interface AnalysisResult {
    emotion: string;
    intensity: number;
    level: IntensityLevel;
    sentiment: 'positive' | 'neutral' | 'negative';
}

const PATTERNS = {
    ANXIETY: ['panic', 'worry', 'scared', 'shaking', 'heart racing', 'breathless'],
    SADNESS: ['sad', 'unhappy', 'cry', 'alone', 'hurt', 'miserable'],
    STRESS: ['stress', 'overwhelmed', 'pressure', 'too much', 'exhausted'],
    ANGER: ['mad', 'furious', 'annoyed', 'pissed', 'frustrated'],
    CRISIS: ['kill myself', 'suicide', 'end it', 'disappear', 'hopeless', 'pointless']
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
        if (PATTERNS.CRISIS.some(p => text.includes(p))) {
            detectedEmotion = 'CRISIS';
        }

        let intensity = Math.min(0.1 + (maxMatches * 0.3), 1.0);
        if (text.includes('very') || text.includes('really') || text.includes('!')) {
            intensity = Math.min(intensity + 0.3, 1.0);
        }

        let level: IntensityLevel = 'low';
        if (intensity > 0.7) level = 'high';
        else if (intensity > 0.3) level = 'medium';

        let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
        if (detectedEmotion !== 'NEUTRAL') sentiment = 'negative';
        else if (text.includes('good') || text.includes('happy')) sentiment = 'positive';

        return { emotion: detectedEmotion, intensity, level, sentiment };
    }
}
