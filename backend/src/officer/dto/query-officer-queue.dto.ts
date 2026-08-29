import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApplicationStatus } from '../../../generated/prisma/client';

export class QueryOfficerQueueDto {
  @ApiPropertyOptional({
    description: 'Filter applications by specific status',
    example: 'approved',
  })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Search string for application number or applicant name',
    example: 'APP-2026',
  })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  page?: any = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
  })
  @IsOptional()
  limit?: any = 10;
}
