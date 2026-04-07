import helplinesData from '../data/helplines.json';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

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
}

// Mocking actual API behavior for now
export const processChatMessage = async (text: string): Promise<{ response: string; risk: RiskLevel }> => {
    const risk = detectLocalRisk(text);

    if (risk === 'CRITICAL' || risk === 'HIGH') {
        return {
            response: "I'm very concerned about what you're saying. Please know that help is available.",
            risk
        };
    }

    // Simplified response logic
    return {
        response: "I'm listening. Thank you for sharing that with me. How else can I help?",
        risk: 'LOW'
    };
};
