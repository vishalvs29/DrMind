import helplinesData from '../data/helplines.json';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EmotionType = 'ANXIETY' | 'STRESS' | 'SADNESS' | 'ANGER' | 'LONELINESS' | 'HOPELESSNESS' | 'NEUTRAL';
export type ActionType = 'none' | 'suggest_session' | 'start_session' | 'show_helpline' | 'force_crisis_ui';

export interface ChatResponse {
    message: string;
    action: ActionType;
    audio: string | null;
    emotion: EmotionType;
    intensity: number;
}

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
    action?: ActionType;
    audio?: string | null;
}

// In production, this would call the backend /chat/message endpoint
export const processChatMessage = async (text: string): Promise<ChatResponse> => {
    // Simulating backend logic for offline resilience or demo purposes
    const lowerText = text.toLowerCase();

    if (lowerText.includes('die') || lowerText.includes('suicide') || lowerText.includes('end it')) {
        return {
            message: "I am deeply concerned about your safety. I am sharing local resources that can help you right now. You are not alone.",
            action: 'force_crisis_ui',
            audio: "https://drmindit.com/assets/audio/emergency_calm.mp3",
            emotion: 'HOPELESSNESS',
            intensity: 0.95
        };
    }

    if (lowerText.includes('anxious') || lowerText.includes('panic')) {
        return {
            message: "I\u0027m hearing a lot of anxiety right now. Let\u0027s take a moment for a box breathing session together.",
            action: 'start_session',
            audio: "https://drmindit.com/assets/audio/box_breathing.mp3",
            emotion: 'ANXIETY',
            intensity: 0.6
        };
    }

    return {
        message: "I'm listening. Thank you for sharing that with me. What else is on your mind?",
        action: 'none',
        audio: null,
        emotion: 'NEUTRAL',
        intensity: 0.1
    };
};
village
