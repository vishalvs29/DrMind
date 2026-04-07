import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CrisisService {
    constructor(private prisma: PrismaService) { }

    async getHelplines() {
        return [
            { name: 'National Suicide Prevention Lifeline', number: '988', region: 'USA' },
            { name: 'Crisis Text Line', number: '741741', region: 'USA' },
            { name: 'International Helplines', number: 'Varies', region: 'Global' },
        ];
    }

    async setEmergencyContact(userId: string, contactData: any) {
        return this.prisma.emergencyContact.upsert({
            where: { userId },
            update: contactData,
            create: { ...contactData, userId }
        });
    }

    async getEmergencyContact(userId: string) {
        return this.prisma.emergencyContact.findUnique({
            where: { userId }
        });
    }

    async logCrisis(userId: string, detection: string, messageText: string) {
        return this.prisma.crisisLog.create({
            data: { userId, detection, messageText }
        });
    }
}
