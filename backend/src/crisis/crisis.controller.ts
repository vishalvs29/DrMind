import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CrisisService } from './crisis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('crisis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crisis')
export class CrisisController {
    constructor(private crisisService: CrisisService) { }

    @Get('helplines')
    async getHelplines() {
        return this.crisisService.getHelplines();
    }

    @Post('contact')
    async setContact(@Body() contactDto: any, @Request() req) {
        return this.crisisService.setEmergencyContact(req.user.userId, contactDto);
    }

    @Get('contact')
    async getContact(@Request() req) {
        return this.crisisService.getEmergencyContact(req.user.userId);
    }
}
