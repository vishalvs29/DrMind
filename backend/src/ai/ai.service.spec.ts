import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { EmotionAnalyzerService } from './emotion-analyzer.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: EmotionAnalyzerService, useValue: {} },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
