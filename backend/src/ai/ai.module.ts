import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { EmotionService } from './emotion.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AiService, EmotionService],
  exports: [AiService, EmotionService]
})
export class AiModule { }
