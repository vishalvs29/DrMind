import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.session.findMany({
            include: { program: true }
        });
    }

    async findOne(id: string) {
        return this.prisma.session.findUnique({
            where: { id },
            include: { program: true }
        });
    }

    async create(data: any) {
        return this.prisma.session.create({ data });
    }
}
