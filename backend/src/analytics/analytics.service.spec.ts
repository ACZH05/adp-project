import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockPrisma = {
    application: {
      groupBy: jest.fn().mockResolvedValue([
        { status: 'submitted', _count: { id: 5 } },
        { status: 'approved', _count: { id: 3 } },
      ]),
      count: jest.fn().mockResolvedValue(10),
      findMany: jest.fn().mockResolvedValue([
        {
          submittedAt: new Date('2026-01-01T00:00:00Z'),
          decidedAt: new Date('2026-01-01T02:00:00Z'),
        },
      ]),
    },
    kpiEvent: {
      aggregate: jest.fn().mockResolvedValue({
        _avg: {
          queueWaitMs: 1500,
          aiProcessingMs: 4000,
          officerProcessingMs: 3600000,
          retryCount: 0.1,
        },
        _count: { id: 10 },
      }),
      count: jest.fn().mockResolvedValue(1),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard summary counts', async () => {
    const res = await service.getDashboardSummary({});
    expect(res.totalApplications).toBe(8);
    expect(res.statusCounts['submitted']).toBe(5);
  });

  it('should calculate KPI metrics correctly', async () => {
    const res = await service.getKpiMetrics({});
    expect(res.incompleteRate).toBeDefined();
    expect(res.cycleTime.averageProcessingTimeHours).toBe(2);
  });

  it('should return queue performance metrics', async () => {
    const res = await service.getQueuePerformanceMetrics({});
    expect(res.metrics.averageQueueWaitMs).toBe(1500);
    expect(res.metrics.deadLetterCount).toBe(1);
  });
});
