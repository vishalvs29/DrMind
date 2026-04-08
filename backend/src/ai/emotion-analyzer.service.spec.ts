import { Test, TestingModule } from '@nestjs/testing';
import { EmotionAnalyzerService } from './emotion-analyzer.service';

describe('EmotionAnalyzerService', () => {
    let service: EmotionAnalyzerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmotionAnalyzerService],
        }).compile();

        service = module.get<EmotionAnalyzerService>(EmotionAnalyzerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('analyze', () => {
        it('should detect ANXIETY with high intensity', () => {
            const result = service.analyze('I am having a panic attack and my heart is racing!');
            expect(result.emotion).toBe('ANXIETY');
            expect(result.intensity).toBeGreaterThan(0.7);
            expect(result.level).toBe('high');
            expect(result.sentiment).toBe('NEGATIVE');
        });

        it('should detect SADNESS', () => {
            const result = service.analyze('I feel so alone and I have been crying all day.');
            expect(result.emotion).toBe('SADNESS');
            expect(result.sentiment).toBe('NEGATIVE');
        });

        it('should detect CRISIS and override other emotions', () => {
            const result = service.analyze('I am so anxious I want to kill myself');
            expect(result.emotion).toBe('CRISIS');
            expect(result.sentiment).toBe('NEGATIVE');
        });

        it('should detect POSITIVE sentiment for happy messages', () => {
            const result = service.analyze('I am feeling good and happy today');
            expect(result.emotion).toBe('NEUTRAL');
            expect(result.sentiment).toBe('POSITIVE');
        });

        it('should return NEUTRAL for unknown input', () => {
            const result = service.analyze('The weather is nice.');
            expect(result.emotion).toBe('NEUTRAL');
            expect(result.sentiment).toBe('NEUTRAL');
        });
    });
});
