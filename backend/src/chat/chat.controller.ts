import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatMessageDto } from './dto/chat-message.dto';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Controller('chat')
export class ChatController {
    constructor(private conversationService: ConversationService) { }

    @Post('message')
    @ApiOperation({ summary: 'Process user chat input with emotional intelligence' })
    async handleMessage(@Request() req, @Body() chatMessageDto: ChatMessageDto) {
        const userId = req.user.id;
        return this.conversationService.processInput(userId, chatMessageDto.text);
    }
}
