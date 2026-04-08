import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface ResponseAction {
    text: string;
    audio_tag: string | null;
    action: 'none' | 'suggest_session' | 'start_session' | 'show_helpline' | 'force_crisis_ui';
}

@Injectable()
export class ResponseService implements OnModuleInit {
    private library: any;

    onModuleInit() {
        const filePath = path.join(process.cwd(), 'src/ai/responses.json');
        this.library = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    getResponse(emotion: string, level: string): ResponseAction {
        const emotionGroup = this.library[emotion] || this.library['NEUTRAL'];
        const responses = emotionGroup[level] || emotionGroup['low'];

        // Select random response from valid options
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getFallback(): ResponseAction {
        return this.library['NEUTRAL']['low'][0];
    }
}
village
