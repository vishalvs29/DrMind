import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { QueueModule } from './../src/queue/queue.module';
import { PrismaService } from './../src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { mockPrismaService, mockJwtService } from './mocks';

import { JwtAuthGuard } from './../src/auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

import { ResponseService } from './../src/ai/response.service';

@Module({})
class MockQueueModule { }

describe('Crisis Detection (e2e)', () => {
    let app: INestApplication;
    const jwtToken: string = 'mock-token';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideModule(QueueModule)
            .useModule(MockQueueModule)
            .overrideGuard(ThrottlerGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { id: 'user-1', email: 'test@example.com' };
                    return true;
                }
            })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .overrideProvider(ResponseService)
            .useValue({
                getResponse: (emotion: string) => {
                    if (emotion === 'CRISIS' || emotion === 'HOPELESSNESS') {
                        return { action: 'force_crisis_ui', text: 'Mocked crisis response' };
                    }
                    return { action: 'none', text: 'Mocked response' };
                }
            })
            .overrideProvider('BullQueue_risk-detection')
            .useValue({ add: jest.fn() })
            .overrideProvider('BullQueue_background-jobs')
            .useValue({ add: jest.fn() })
            .overrideProvider('BullQueue_analytics')
            .useValue({ add: jest.fn() })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Setup common mocks for auth and chat history
        (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue({
            id: 'user-1',
            email: 'test@example.com'
        });
        (mockPrismaService.chatHistory.create as jest.Mock).mockResolvedValue({});
        (mockPrismaService.crisisEvent.create as jest.Mock).mockResolvedValue({});
    });

    it('should detect crisis trigger word in chat and return force_crisis_ui action', () => {
        return request(app.getHttpServer())
            .post('/chat/message')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ text: 'I want to kill myself' })
            .expect(201)
            .expect((res) => {
                expect(res.body.action).toBe('force_crisis_ui');
            });
    });

    it('should handle case-insensitive trigger variants (regression test for casing bug)', () => {
        return request(app.getHttpServer())
            .post('/chat/message')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ text: 'HELP ME I WANT TO KILL MYSELF' })
            .expect(201)
            .expect((res) => {
                expect(res.body.action).toBe('force_crisis_ui');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
