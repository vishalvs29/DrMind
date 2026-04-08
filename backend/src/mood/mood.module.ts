import { Module } from '@nestjs/common';
import { MoodService } from './mood.service';
import { MoodController } from './mood.controller';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [MoodService, PrismaService],
    controllers: [MoodController],
    exports: [MoodService]
})
export class MoodModule { }
