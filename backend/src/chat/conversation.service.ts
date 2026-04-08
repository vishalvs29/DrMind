import { Injectable } from '@nestjs/common';
import { EmotionAnalyzerService, AnalysisResult } from './emotion-analyzer.service';
import { ResponseService, ResponseAction } from './response.service';
import { audioMap } from './audioMap';

@Injectable()
export class ConversationService {
    constructor(
        private analyzer: EmotionAnalyzerService,
        private responder: ResponseService
    ) { }

    async processInput(userId: string, input: string) {
        const analysis = this.analyzer.analyze(input);
        const response = this.responder.getResponse(analysis.emotion, analysis.level);

        // Map audio tag to external URL
        const audioUrl = response.audio_tag ? audioMap[response.audio_tag] : null;

        return {
            message: response.text,
            action: response.action,
            audio: audioUrl,
            emotion: analysis.emotion,
            intensity: analysis.intensity,
            sentiment: analysis.sentiment
        };
    }
}
village
