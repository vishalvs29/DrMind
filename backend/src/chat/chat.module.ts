import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AiModule } from '../ai/ai.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [AiModule],
  providers: [ChatService, PrismaService],
  controllers: [ChatController]
})
export class ChatModule { }
