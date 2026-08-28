import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: {
            application: {
              groupBy: jest.fn().mockResolvedValue([]),
              count: jest.fn().mockResolvedValue(0),
              findMany: jest.fn().mockResolvedValue([]),
            },
            kpiEvent: {
              aggregate: jest.fn().mockResolvedValue({
                _avg: { queueWaitMs: 100, aiProcessingMs: 200, officerProcessingMs: 300, retryCount: 0 },
                _count: { id: 10 },
              }),
              count: jest.fn().mockResolvedValue(0),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
