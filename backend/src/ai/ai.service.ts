import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
    constructor(private configService: ConfigService) { }

    async generateResponse(prompt: string, context: string = ''): Promise<string> {
        // This would be the actual OpenAI/LLM call
        // For now, mirroring a simplified AI response logic
        console.log(`AI Processing prompt: ${prompt}`);

        const lowerText = prompt.toLowerCase();
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return "Hello! I'm DrMindit, your mental health companion. How are you feeling today?";
        }
        if (lowerText.includes('stress') || lowerText.includes('anxious')) {
            return "I'm sorry you're feeling stressed. Have you tried one of our guided resilience sessions? They're designed specifically for moments like this.";
        }
        return "Thank you for sharing that. I'm here to listen and support your journey toward better mental health.";
    }

    async detectIntents(text: string): Promise<string[]> {
        const intents: string[] = [];
        if (text.toLowerCase().includes('kill') || text.toLowerCase().includes('suicide')) {
            intents.push('CRISIS');
        }
        return intents;
    }
}
