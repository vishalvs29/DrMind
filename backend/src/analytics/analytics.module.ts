import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PrismaService } from '../prisma.service';
import { QueueModule } from '../queue/queue.module';
import { RiskProcessor } from './risk.processor';

@Module({
  imports: [QueueModule],
  providers: [AnalyticsService, PrismaService, RiskProcessor],
  controllers: [AnalyticsController]
})
export class AnalyticsModule { }
