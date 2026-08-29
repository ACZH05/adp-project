import { Test, TestingModule } from '@nestjs/testing';
import { OfficerController } from './officer.controller';
import { OfficerService } from './officer.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OfficerController', () => {
  let controller: OfficerController;
  let service: OfficerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficerController],
      providers: [
        OfficerService,
        {
          provide: PrismaService,
          useValue: {
            application: {
              count: jest.fn().mockResolvedValue(1),
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue({ id: 'app-uuid' }),
              update: jest.fn().mockResolvedValue({ id: 'app-uuid' }),
            },
            officerDecision: {
              create: jest.fn().mockResolvedValue({ id: 'decision-uuid' }),
              findMany: jest.fn().mockResolvedValue([]),
            },
            auditLog: {
              create: jest.fn().mockResolvedValue({ id: 'audit-uuid' }),
            },
            kpiEvent: {
              create: jest.fn().mockResolvedValue({ id: 'kpi-uuid' }),
            },
            $transaction: jest.fn().mockImplementation((cb) => cb(PrismaService)),
          },
        },
      ],
    }).compile();

    controller = module.get<OfficerController>(OfficerController);
    service = module.get<OfficerService>(OfficerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
