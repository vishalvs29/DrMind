import { Provider } from '@nestjs/common';
import { PrismaService } from '../src/prisma.service';
import { JwtService } from '@nestjs/jwt';

export const mockPrismaService = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    crisisEvent: {
        create: jest.fn(),
        deleteMany: jest.fn(),
    },
    emergencyHelpline: {
        findMany: jest.fn(),
        count: jest.fn(),
        createMany: jest.fn(),
    },
    userSessionProgress: {
        deleteMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
    },
    chatHistory: {
        deleteMany: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
    },
    moodLog: {
        deleteMany: jest.fn(),
        create: jest.fn(),
    },
    riskScore: {
        deleteMany: jest.fn(),
    },
};

export const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
    verify: jest.fn().mockReturnValue({ id: 'user-1' }),
};

export const PrismaMockProvider: Provider = {
    provide: PrismaService,
    useValue: mockPrismaService,
};

export const JwtMockProvider: Provider = {
    provide: JwtService,
    useValue: mockJwtService,
};
