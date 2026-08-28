import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAnalyticsDto } from './dto/query-analytics.dto';
import { ApplicationStatus } from '../../generated/prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns application count distribution by status.
   */
  async getDashboardSummary(query: QueryAnalyticsDto) {
    const whereClause: any = {
      status: { not: ApplicationStatus.draft },
    };

    if (query.startDate || query.endDate) {
      whereClause.createdAt = {};
      if (query.startDate) whereClause.createdAt.gte = new Date(query.startDate);
      if (query.endDate) whereClause.createdAt.lte = new Date(query.endDate);
    }

    const grouped = await this.prisma.application.groupBy({
      by: ['status'],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    const statusCounts: Record<string, number> = {};
    let totalApplications = 0;

    for (const item of grouped) {
      statusCounts[item.status] = item._count.id;
      totalApplications += item._count.id;
    }

    return {
      totalApplications,
      statusCounts,
      queryFilter: {
        startDate: query.startDate ?? null,
        endDate: query.endDate ?? null,
      },
    };
  }

  /**
   * Calculates KPI targets (incomplete rate reduction & cycle processing time).
   */
  async getKpiMetrics(query: QueryAnalyticsDto) {
    const whereClause: any = {
      submittedAt: { not: null },
    };

    if (query.startDate || query.endDate) {
      whereClause.submittedAt = {};
      if (query.startDate) whereClause.submittedAt.gte = new Date(query.startDate);
      if (query.endDate) whereClause.submittedAt.lte = new Date(query.endDate);
    }

    const [totalSubmitted, correctionRequiredCount, decidedApplications] = await Promise.all([
      this.prisma.application.count({ where: whereClause }),
      this.prisma.application.count({
        where: {
          ...whereClause,
          status: ApplicationStatus.correction_required,
        },
      }),
      this.prisma.application.findMany({
        where: {
          ...whereClause,
          decidedAt: { not: null },
        },
        select: {
          submittedAt: true,
          decidedAt: true,
        },
      }),
    ]);

    // Incomplete Rate Calculation
    const currentIncompleteRate = totalSubmitted > 0
      ? (correctionRequiredCount / totalSubmitted) * 100
      : 0;

    // Standard baseline for manual process (e.g. 40% incomplete)
    const baselineIncompleteRate = 40.0;
    const reductionPercent = baselineIncompleteRate > 0
      ? ((baselineIncompleteRate - currentIncompleteRate) / baselineIncompleteRate) * 100
      : 0;

    // End-to-end Processing Cycle Time
    let totalProcessingMs = 0;
    for (const app of decidedApplications) {
      if (app.submittedAt && app.decidedAt) {
        totalProcessingMs += app.decidedAt.getTime() - app.submittedAt.getTime();
      }
    }

    const avgProcessingTimeHours = decidedApplications.length > 0
      ? (totalProcessingMs / decidedApplications.length) / (1000 * 60 * 60)
      : 0;

    return {
      incompleteRate: {
        baselineRatePercent: baselineIncompleteRate,
        currentRatePercent: Number(currentIncompleteRate.toFixed(2)),
        reductionPercentAchieved: Number(reductionPercent.toFixed(2)),
        meetsTarget: reductionPercent >= 60.0,
        totalSubmitted,
        correctionRequiredCount,
      },
      cycleTime: {
        totalDecidedCases: decidedApplications.length,
        averageProcessingTimeHours: Number(avgProcessingTimeHours.toFixed(2)),
        targetTimeHours: 48.0, // e.g. 48 hours target
      },
    };
  }

  /**
   * Aggregates verification queue metrics from KpiEvent entries.
   */
  async getQueuePerformanceMetrics(query: QueryAnalyticsDto) {
    const whereClause: any = {};

    if (query.startDate || query.endDate) {
      whereClause.occurredAt = {};
      if (query.startDate) whereClause.occurredAt.gte = new Date(query.startDate);
      if (query.endDate) whereClause.occurredAt.lte = new Date(query.endDate);
    }

    const aggregations = await this.prisma.kpiEvent.aggregate({
      where: whereClause,
      _avg: {
        queueWaitMs: true,
        aiProcessingMs: true,
        officerProcessingMs: true,
        retryCount: true,
      },
      _count: {
        id: true,
      },
    });

    const deadLetterCount = await this.prisma.kpiEvent.count({
      where: {
        ...whereClause,
        isDeadLetter: true,
      },
    });

    const totalEvents = aggregations._count.id;
    const deadLetterRate = totalEvents > 0 ? (deadLetterCount / totalEvents) * 100 : 0;

    return {
      totalKpiEvents: totalEvents,
      metrics: {
        averageQueueWaitMs: Math.round(aggregations._avg.queueWaitMs ?? 0),
        averageAiProcessingMs: Math.round(aggregations._avg.aiProcessingMs ?? 0),
        averageOfficerProcessingMs: Math.round(aggregations._avg.officerProcessingMs ?? 0),
        averageRetryCount: Number((aggregations._avg.retryCount ?? 0).toFixed(2)),
        deadLetterCount,
        deadLetterRatePercent: Number(deadLetterRate.toFixed(2)),
      },
    };
  }

  /**
   * Exports aggregated analytical metrics for management reporting.
   */
  async exportReport(query: QueryAnalyticsDto) {
    const [summary, kpis, queueMetrics] = await Promise.all([
      this.getDashboardSummary(query),
      this.getKpiMetrics(query),
      this.getQueuePerformanceMetrics(query),
    ]);

    return {
      reportTitle: 'Entertainment License Application Analytics & KPI Report',
      generatedAt: new Date().toISOString(),
      summary,
      kpis,
      queueMetrics,
    };
  }
}
