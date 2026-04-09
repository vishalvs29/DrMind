import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaMockProvider } from '../../test/mocks';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        PrismaMockProvider,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return user profile', async () => {
      const mockUser = { id: 'u1', name: 'Test User', email: 'test@example.com', role: 'STUDENT' };
      const req = { user: { id: 'u1' } };

      // Mock the prisma findUnique call
      (controller as any).prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue(mockUser)
        }
      };

      const result = await controller.getMe(req);
      expect(result).toEqual(mockUser);
    });
  });
});
