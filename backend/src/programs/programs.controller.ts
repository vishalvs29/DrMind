import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('programs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('programs')
export class ProgramsController {
    constructor(private programsService: ProgramsService) { }

    @Get()
    async findAll() {
        return this.programsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        return this.programsService.getProgramWithUserProgress(req.user.userId, id);
    }

    @Post('progress')
    async updateProgress(@Body() progressDto: any, @Request() req) {
        return this.programsService.updateProgress(
            req.user.userId,
            progressDto.sessionId,
            progressDto.completed,
            progressDto.progressSec
        );
    }
}
