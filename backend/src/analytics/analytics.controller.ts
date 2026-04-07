import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('trends')
    async getTrends(@Request() req) {
        return this.analyticsService.getMoodTrends(req.user.userId);
    }

    @Get('insights')
    async getInsights(@Request() req) {
        const stressScore = await this.analyticsService.calculateStressScore(req.user.userId);
        const engagement = await this.analyticsService.getEngagementMetrics(req.user.userId);

        return {
            stressScore,
            engagement,
            riskLevel: stressScore > 70 ? 'HIGH' : stressScore > 40 ? 'MEDIUM' : 'LOW'
        };
    }
}
