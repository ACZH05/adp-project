import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from './verification.service';

describe('VerificationService', () => {
  let service: VerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        {
          provide: 'BullQueue_verification',
          useValue: { add: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
