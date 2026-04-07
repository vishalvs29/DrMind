export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    intent?: string;
    isCrisis?: boolean;
}

const CRISIS_KEYWORDS = [
    'kill myself',
    'suicide',
    'hurt myself',
    'end my life',
    'don\'t want to live',
    'no point in living',
];

class ChatService {
    private messages: Message[] = [];

    detectCrisis(text: string): boolean {
        const lowerText = text.toLowerCase();
        return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
    }

    async sendMessage(text: string): Promise<Message[]> {
        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date(),
            isCrisis: this.detectCrisis(text),
        };

        this.messages.push(userMessage);

        if (userMessage.isCrisis) {
            const crisisResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm concerned about what you're saying. Please know that you're not alone and there is help available. If you're in immediate danger, please call a crisis helpline or emergency services.",
                sender: 'ai',
                timestamp: new Date(),
                intent: 'crisis_alert',
            };
            this.messages.push(crisisResponse);
            return [userMessage, crisisResponse];
        }

        // Mock AI Response
        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: this.getMockResponse(text),
            sender: 'ai',
            timestamp: new Date(),
        };

        this.messages.push(aiResponse);
        return [userMessage, aiResponse];
    }

    private getMockResponse(text: string): string {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return "Hello! I'm DrMindit, your mental health companion. How are you feeling today?";
        }
        if (lowerText.includes('stress') || lowerText.includes('anxious')) {
            return "I'm sorry you're feeling stressed. Have you tried one of our guided resilience sessions today? They're designed specifically for moments like this.";
        }
        if (lowerText.includes('sleep')) {
            return "Sleep is so important for mental health. Our 'Deep Sleep' sounds might help you relax. Would you like to try them?";
        }
        return "Thank you for sharing that with me. I'm here to listen and support your journey toward better mental health.";
    }
}

export const chatService = new ChatService();
