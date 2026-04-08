import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ConversationService } from './conversation.service';
import { JwtService } from '@nestjs/jwt';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ConversationService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
