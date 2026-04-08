import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('session')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) { }

    @Get()
    async findAll() {
        return this.sessionsService.findAll();
    }

    @Get('progress/:userId')
    async getResume(@Param('userId') userId: string) {
        return this.sessionsService.getResumeProgress(userId);
    }

    @Post('start')
    async start(@Request() req, @Body() body: { sessionId: string }) {
        return this.sessionsService.updateProgress(req.user.userId, {
            sessionId: body.sessionId,
            currentStepIndex: 0,
            progressSeconds: 0
        });
    }

    @Post('progress')
    async updateProgress(@Request() req, @Body() body: any) {
        return this.sessionsService.updateProgress(req.user.userId, body);
    }

    @Post('step-complete')
    async completeStep(@Request() req, @Body() body: { sessionId: string, stepId: string }) {
        return this.sessionsService.completeStep(req.user.userId, body.sessionId, body.stepId);
    }

    @Post('complete')
    async completeSession(@Request() req, @Body() body: { sessionId: string }) {
        return this.sessionsService.completeSession(req.user.userId, body.sessionId);
    }
}
