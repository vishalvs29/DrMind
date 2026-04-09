import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { EmotionAnalyzerService } from './emotion-analyzer.service';
import { ResponseService } from './response.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AiService, EmotionAnalyzerService, ResponseService],
  exports: [AiService, EmotionAnalyzerService, ResponseService]
})
export class AiModule { }
