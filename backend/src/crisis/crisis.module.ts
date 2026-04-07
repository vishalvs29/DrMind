import { Module } from '@nestjs/common';
import { CrisisService } from './crisis.service';
import { CrisisController } from './crisis.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [CrisisService, PrismaService],
  controllers: [CrisisController],
  exports: [CrisisService],
})
export class CrisisModule { }
