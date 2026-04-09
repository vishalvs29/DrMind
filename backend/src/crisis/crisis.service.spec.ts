import { Test, TestingModule } from '@nestjs/testing';
import { CrisisService } from './crisis.service';
import { PrismaMockProvider } from '../../test/mocks';

jest.mock('@prisma/client', () => ({
  ...jest.requireActual('@prisma/client'),
  RiskLevel: { LOW: 'LOW', MEDIUM: 'MEDIUM', HIGH: 'HIGH', CRITICAL: 'CRITICAL' },
}));

describe('CrisisService', () => {
  let service: CrisisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrisisService,
        PrismaMockProvider,
      ],
    }).compile();

    service = module.get<CrisisService>(CrisisService);
  });

  it('should detect CRITICAL risk for suicidal phrases', async () => {
    const result = await service.detectRisk('I want to kill myself right now');
    expect(result.level).toBe('CRITICAL');
    expect(result.score).toBe(95);
  });

  it('should detect HIGH risk for hopeless phrases', async () => {
    const result = await service.detectRisk('I have no reason to live, everything is pointless');
    expect(result.level).toBe('HIGH');
    expect(result.score).toBe(75);
  });

  it('should detect MEDIUM risk for general distress', async () => {
    const result = await service.detectRisk('I am so overwhelmed and anxious lately');
    expect(result.level).toBe('MEDIUM');
    expect(result.score).toBe(45);
  });

  it('should detect LOW risk for neutral text', async () => {
    const result = await service.detectRisk('I am just writing a note.');
    expect(result.level).toBe('LOW');
    expect(result.score).toBe(10);
  });
});
