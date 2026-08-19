import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationService } from './application.service';
import { SubmitApplicationDto } from './dto/submit-application.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('draft')
  @ApiOperation({ summary: 'Save an application draft' })
  @ApiBody({ type: SubmitApplicationDto })
  @ApiCreatedResponse({ description: 'Draft saved successfully.' })
  async saveDraft(@Body() dto: SubmitApplicationDto) {
    return await this.applicationService.upsertApplication(dto, 'draft');
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit an application for verification' })
  @ApiBody({ type: SubmitApplicationDto })
  @ApiCreatedResponse({ description: 'Application submitted and verification enqueued successfully.' })
  async submit(@Body() dto: SubmitApplicationDto) {
    return await this.applicationService.upsertApplication(dto, 'submitted');
  }
}
