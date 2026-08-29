import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOfficerDecisionDto } from './dto/create-officer-decision.dto';
import { QueryOfficerQueueDto } from './dto/query-officer-queue.dto';
import { OfficerService } from './officer.service';

@ApiTags('officer')
@Controller('officer')
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  @Get('applications')
  @ApiOperation({ summary: 'Retrieve officer review queue with status filter, search, and pagination' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved review queue applications.' })
  async getReviewQueue(@Query() query: QueryOfficerQueueDto) {
    return await this.officerService.getReviewQueue(query);
  }

  @Get('applications/:id')
  @ApiOperation({ summary: 'Get detailed application case information for officer review' })
  @ApiParam({ name: 'id', description: 'Application UUID', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved application details.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  async getApplicationDetail(@Param('id') id: string) {
    return await this.officerService.getApplicationDetail(id);
  }

  @Post('applications/:id/decision')
  @ApiOperation({ summary: 'Submit officer review decision (Approve, Reject, Request Correction)' })
  @ApiParam({ name: 'id', description: 'Application UUID or Application No', type: String })
  @ApiBody({ type: CreateOfficerDecisionDto })
  @ApiResponse({ status: 201, description: 'Officer decision submitted and application status updated.' })
  @ApiResponse({ status: 400, description: 'Invalid payload or application state.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  async submitDecision(
    @Param('id') id: string,
    @Body() dto: CreateOfficerDecisionDto,
  ) {
    try {
      return await this.officerService.submitDecision(id, dto);
    } catch (err: any) {
      console.error('Error in submitDecision controller:', err);
      throw err;
    }
  }

  @Get('applications/:id/decisions')
  @ApiOperation({ summary: 'Get historical officer decision log for an application' })
  @ApiParam({ name: 'id', description: 'Application UUID or Application No', type: String })
  @ApiResponse({ status: 200, description: 'Successfully retrieved decision history.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  async getDecisionHistory(@Param('id') id: string) {
    return await this.officerService.getDecisionHistory(id);
  }
}
