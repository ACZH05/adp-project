import { Test, TestingModule } from '@nestjs/testing';
import { OfficerService } from './officer.service';
import { PrismaService } from '../prisma/prisma.service';
import { OfficerDecisionType } from '../../generated/prisma/client';

describe('OfficerService', () => {
  let service: OfficerService;
  let prisma: PrismaService;

  const mockPrisma = {
    application: {
      count: jest.fn().mockResolvedValue(1),
      findMany: jest.fn().mockResolvedValue([
        { id: 'app-1', applicationNo: 'APP-2026-0001', status: 'pending_officer_review' },
      ]),
      findUnique: jest.fn().mockResolvedValue({
        id: 'app-1',
        currentApplicationVersionId: 'ver-1',
        submittedAt: new Date(),
      }),
      update: jest.fn().mockResolvedValue({ id: 'app-1', status: 'approved' }),
    },
    officerDecision: {
      create: jest.fn().mockResolvedValue({ id: 'dec-1', decisionType: 'approved' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue({ id: 'aud-1' }),
    },
    kpiEvent: {
      create: jest.fn().mockResolvedValue({ id: 'kpi-1' }),
    },
    $transaction: jest.fn().mockImplementation(async (cb) => {
      return await cb(mockPrisma);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfficerService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<OfficerService>(OfficerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return review queue items', async () => {
    const result = await service.getReviewQueue({});
    expect(result.data).toBeDefined();
    expect(result.total).toBe(1);
  });

  it('should execute submitDecision in a transaction', async () => {
    const result = await service.submitDecision('app-1', {
      decisionType: OfficerDecisionType.approved,
      officerUserId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    });

    expect(result.application.status).toBe('approved');
    expect(result.decision.decisionType).toBe('approved');
  });
});
