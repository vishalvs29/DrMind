import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: { findOne: jest.fn(), create: jest.fn(), updatePassword: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn(() => 'mock-token') } },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const vals: Record<string, string> = {
                SUPABASE_URL: '',   // empty → supabase client not created in tests
                SUPABASE_SERVICE_ROLE_KEY: '',
                PASSWORD_RESET_REDIRECT_URL: 'https://app.drmind.io/reset-password',
                JWT_SECRET: 'test-secret',
              };
              return vals[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a login token', async () => {
    const fakeUser = { id: '1', email: 'a@b.com', name: 'Test', role: 'STUDENT' };
    const result = await service.login(fakeUser);
    expect(result).toHaveProperty('access_token');
  });

  it('forgotPassword should throw if SUPABASE_URL is not configured', async () => {
    await expect(service.forgotPassword('a@b.com')).rejects.toThrow();
  });

  it('resetPassword should throw 400 if no token provided', async () => {
    await expect(service.resetPassword('', 'newpass')).rejects.toThrow();
  });
});
