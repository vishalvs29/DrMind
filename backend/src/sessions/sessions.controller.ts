import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionsController {
    constructor(private sessionsService: SessionsService) { }

    @Get()
    async findAll() {
        return this.sessionsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.sessionsService.findOne(id);
    }
}
