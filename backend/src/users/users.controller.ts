import { Controller, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) { }

    @Delete('me')
    @ApiOperation({ summary: 'Delete current user account and all related data (GDPR)' })
    async deleteMe(@Request() req) {
        const userId = req.user.id;

        // Use a transaction to ensure all user data is removed
        return this.prisma.$transaction(async (tx: any) => {
            // Delete related records manually if not set to cascade in schema
            await tx.chatHistory.deleteMany({ where: { userId } });
            await tx.moodLog.deleteMany({ where: { userId } });
            await tx.userSessionProgress.deleteMany({ where: { userId } });
            await tx.crisisEvent.deleteMany({ where: { userId } });
            await tx.riskScore.deleteMany({ where: { userId } });

            return tx.user.delete({ where: { id: userId } });
        });
    }
}
