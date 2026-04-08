import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { EmotionAnalyzerService } from './emotion-analyzer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AiService, EmotionAnalyzerService],
  exports: [AiService, EmotionAnalyzerService]
})
export class AiModule { }
