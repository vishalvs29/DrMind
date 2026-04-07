import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { SessionsModule } from './sessions/sessions.module';
import { ProgramsModule } from './programs/programs.module';
import { AiModule } from './ai/ai.module';
import { ChatModule } from './chat.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CrisisModule } from './crisis/crisis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule,
    UsersModule,
    SessionsModule,
    ProgramsModule,
    AiModule,
    ChatModule,
    AnalyticsModule,
    CrisisModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
