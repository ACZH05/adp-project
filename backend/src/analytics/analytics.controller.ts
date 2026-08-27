import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { QueryAnalyticsDto } from './dto/query-analytics.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get application distribution counts by status' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved dashboard summary.' })
  async getDashboardSummary(@Query() query: QueryAnalyticsDto) {
    return await this.analyticsService.getDashboardSummary(query);
  }

  @Get('kpis')
  @ApiOperation({ summary: 'Get KPI baseline metrics (incomplete application reduction and cycle processing times)' })
  @ApiResponse({ status: 200, description: 'Successfully calculated KPI metrics.' })
  async getKpiMetrics(@Query() query: QueryAnalyticsDto) {
    return await this.analyticsService.getKpiMetrics(query);
  }

  @Get('queue-metrics')
  @ApiOperation({ summary: 'Get verification queue performance metrics (wait time, AI processing time, retries, dead-letter rate)' })
  @ApiResponse({ status: 200, description: 'Successfully aggregated queue performance metrics.' })
  async getQueuePerformanceMetrics(@Query() query: QueryAnalyticsDto) {
    return await this.analyticsService.getQueuePerformanceMetrics(query);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export complete analytics and KPI report for management' })
  @ApiResponse({ status: 200, description: 'Successfully generated management analytics report.' })
  async exportReport(@Query() query: QueryAnalyticsDto) {
    return await this.analyticsService.exportReport(query);
  }
}
