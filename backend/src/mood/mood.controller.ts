import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('mood')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mood')
export class MoodController {
    constructor(private moodService: MoodService) { }

    @Post()
    @ApiOperation({ summary: 'Log daily mood' })
    async logMood(@Request() req: any, @Body() dto: CreateMoodDto) {
        return this.moodService.logMood(req.user.userId, dto);
    }

    @Get('history')
    @ApiOperation({ summary: 'Get mood history for current user' })
    async getHistory(@Request() req: any) {
        return this.moodService.getHistory(req.user.userId);
    }
}
