import { Test, TestingModule } from '@nestjs/testing';
import { CrisisController } from './crisis.controller';
import { CrisisService } from './crisis.service';
import { JwtService } from '@nestjs/jwt';

describe('CrisisController', () => {
  let controller: CrisisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrisisController],
      providers: [
        { provide: CrisisService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<CrisisController>(CrisisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
