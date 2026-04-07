import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { CrisisService } from './crisis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('crisis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crisis')
export class CrisisController {
    constructor(private crisisService: CrisisService) { }

    @Get('helplines')
    @ApiOperation({ summary: 'Get localized helplines based on country code' })
    async getHelplines(@Query('country') country: string) {
        return this.crisisService.getHelplines(country || 'US');
    }

    @Get('seed')
    @ApiOperation({ summary: 'Seed initial helpline data (Admin/Internal)' })
    async seed() {
        await this.crisisService.seedInitialHelplines();
        return { status: 'success' };
    }
}
