import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { OfficerDecisionType } from '../../../generated/prisma/client';

export class CreateOfficerDecisionDto {
  @ApiProperty({
    description: 'Decision type rendered by officer',
    enum: OfficerDecisionType,
    example: OfficerDecisionType.approved,
  })
  @IsEnum(OfficerDecisionType)
  @IsNotEmpty()
  decisionType: OfficerDecisionType;

  @ApiPropertyOptional({
    description: 'Predefined reason code for rejection or correction request',
    example: 'DOC_ILLEGIBLE_OR_EXPIRED',
  })
  @IsString()
  @IsOptional()
  reasonCode?: string;

  @ApiPropertyOptional({
    description: 'Plain language explanation for applicant decision feedback',
    example: 'Premise floor plan document is blurry. Please upload a clear PDF.',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Internal note reserved for officers and administrative audit',
    example: 'Verified premise address against municipal database.',
  })
  @IsString()
  @IsOptional()
  officerNote?: string;

  @ApiPropertyOptional({
    description: 'UUID of the deciding officer (Transitional until S1 auth guard)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsString()
  @IsOptional()
  officerUserId?: string;
}
