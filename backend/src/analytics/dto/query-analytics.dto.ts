import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatus } from '../../../generated/prisma/client';

export class QueryAnalyticsDto {
  @ApiPropertyOptional({
    description: 'Start date ISO string filter for analytics calculation',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date ISO string filter for analytics calculation',
    example: '2026-12-31T23:59:59.999Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Optional status filter',
    enum: ApplicationStatus,
  })
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;
}
