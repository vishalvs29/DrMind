import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ProgramsService, PrismaService],
  controllers: [ProgramsController]
})
export class ProgramsModule { }
