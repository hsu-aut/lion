import { Test, TestingModule } from '@nestjs/testing';
import { BackendController } from './backend.controller';
import { BackendService } from './backend.service';

describe('BackendController', () => {
  let backendController: BackendController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BackendController],
      providers: [BackendService],
    }).compile();

    backendController = app.get<BackendController>(BackendController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(backendController.getHello()).toBe('Hello World!');
    });
  });
});
