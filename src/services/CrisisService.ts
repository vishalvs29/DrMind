import helplinesData from '../data/helplines.json';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EmotionType = 'ANXIETY' | 'STRESS' | 'SADNESS' | 'ANGER' | 'LONELINESS' | 'HOPELESSNESS' | 'NEUTRAL';
export type ActionType = 'NONE' | 'SUGGEST_SESSION' | 'START_SESSION' | 'SHOW_HELPLINE' | 'FORCE_CRISIS_UI';

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
    try {
        const token = localStorage.getItem('token'); // Simplistic for demo, in real app use a secure storage
        const response = await fetch(`${process.env.API_URL || 'http://localhost:3000'}/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch AI response');
        }

        const data = await response.json();
        return {
            message: data.message,
            action: data.action as ActionType,
            audio: data.audio,
            emotion: data.emotion as EmotionType,
            intensity: data.intensity
        };
    } catch (error) {
        console.error('Chat API Error:', error);
        return {
            message: "I'm having trouble connecting right now. Please try again or reach out to a helpline if you need immediate support.",
            action: 'NONE',
            audio: null,
            emotion: 'NEUTRAL',
            intensity: 0.1
        };
    }
};
