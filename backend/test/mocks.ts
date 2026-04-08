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
    },
    emergencyHelpline: {
        findMany: jest.fn(),
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
