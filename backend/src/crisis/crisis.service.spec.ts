import { Test, TestingModule } from '@nestjs/testing';
import { CrisisService } from './crisis.service';
import { PrismaMockProvider } from '../../test/mocks';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
