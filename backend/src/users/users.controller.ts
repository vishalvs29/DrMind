import { Controller, Get, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    async getMe(@Request() req) {
        const userId = req.user.id;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true, organization: true }
        });
        return user;
    }

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
