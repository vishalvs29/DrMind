import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Post()
    async sendMessage(@Body() body: { text: string }, @Request() req) {
        return this.chatService.processMessage(req.user.userId, body.text);
    }

    @Get('history')
    async getHistory(@Request() req) {
        return this.chatService.getHistory(req.user.userId);
    }
}
