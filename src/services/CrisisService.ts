import helplinesData from '../data/helplines.json';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EmotionType = 'ANXIETY' | 'STRESS' | 'SADNESS' | 'ANGER' | 'LONELINESS' | 'HOPELESSNESS' | 'NEUTRAL';

const RISK_PATTERNS = {
    CRITICAL: [
        'kill myself', 'suicide', 'end my life', 'better off dead',
        'hurt myself', 'taking my own life'
    ],
    HIGH: [
        'want to disappear', 'no reason to live', 'end everything',
        'hate my life', 'give up'
    ]
};

const EMOTION_PATTERNS: Record<EmotionType, string[]> = {
    ANXIETY: ['anxious', 'panic', 'scared', 'worry', 'breathless', 'nervous'],
    STRESS: ['stress', 'overwhelmed', 'too much', 'exhausted', 'burnout'],
    SADNESS: ['sad', 'crying', 'unhappy', 'miss', 'hurt', 'pain', 'miserable'],
    ANGER: ['angry', 'mad', 'hate', 'furious', 'annoyed', 'frustrated'],
    LONELINESS: ['lonely', 'alone', 'no one', 'isolated', 'ignored'],
    HOPELESSNESS: ['hopeless', 'pointless', 'no future', 'disappear', 'give up'],
    NEUTRAL: []
};

export const analyzeLocalEmotion = (text: string): { emotion: EmotionType; intensity: number } => {
    const lowerText = text.toLowerCase();
    let detectedEmotion: EmotionType = 'NEUTRAL';
    let maxMatches = 0;

    for (const [emotion, patterns] of Object.entries(EMOTION_PATTERNS)) {
        const matchCount = patterns.filter(p => lowerText.includes(p)).length;
        if (matchCount > maxMatches) {
            maxMatches = matchCount;
            detectedEmotion = emotion as EmotionType;
        }
    }

    let intensity = Math.min(0.2 + (maxMatches * 0.2), 1.0);
    if (lowerText.includes('very') || lowerText.includes('really') || lowerText.includes('!')) {
        intensity = Math.min(intensity + 0.2, 1.0);
    }

    return { emotion: detectedEmotion, intensity };
};

export const detectLocalRisk = (text: string): RiskLevel => {
    const lowerText = text.toLowerCase();
    if (RISK_PATTERNS.CRITICAL.some(p => lowerText.includes(p))) return 'CRITICAL';
    if (RISK_PATTERNS.HIGH.some(p => lowerText.includes(p))) return 'HIGH';
    return 'LOW';
};

export const getLocalHelplines = (countryCode: string = 'US') => {
    const data = helplinesData as any;
    return data[countryCode] || data['GLOBAL'];
};

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    isCrisis?: boolean;
    emotion?: EmotionType;
}

export const processChatMessage = async (text: string): Promise<{ response: string; risk: RiskLevel; emotion: EmotionType }> => {
    const risk = detectLocalRisk(text);
    const { emotion, intensity } = analyzeLocalEmotion(text);

    if (risk === 'CRITICAL' || risk === 'HIGH') {
        return {
            response: "I'm very concerned about what you're saying. Please know that help is available and you don't have to carry this alone.",
            risk,
            emotion: 'HOPELESSNESS'
        };
    }

    if (emotion === 'ANXIETY' || emotion === 'STRESS') {
        return {
            response: "It sounds like you're feeling a bit overwhelmed. Would you like to try a quick breathing session together?",
            risk: 'LOW',
            emotion
        };
    }

    if (emotion === 'SADNESS') {
        return {
            response: "I'm really sorry things are feeling so heavy right now. What's been weighng on you the most?",
            risk: 'LOW',
            emotion
        };
    }

    return {
        response: "I'm listening. Thank you for sharing that with me. What else is on your mind?",
        risk: 'LOW',
        emotion: 'NEUTRAL'
    };
};
