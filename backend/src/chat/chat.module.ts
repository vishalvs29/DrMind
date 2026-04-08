import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ChatController } from './chat.controller';
import { AiModule } from '../ai/ai.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [AiModule],
  providers: [ConversationService, PrismaService],
  controllers: [ChatController]
})
export class ChatModule { }
