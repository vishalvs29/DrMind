import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private conversationService: ConversationService) { }

    @Post('message')
    @ApiOperation({ summary: 'Process user chat input with emotional intelligence' })
    async handleMessage(@Request() req, @Body('text') text: string) {
        const userId = req.user.id;
        return this.conversationService.processInput(userId, text);
    }
}
