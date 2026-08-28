import { Body, Controller, Post, Get, Query, BadRequestException } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
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

  @Get()
  @ApiOperation({ summary: 'Get applications for a logged-in user by email' })
  @ApiQuery({ name: 'email', required: true, description: 'User email' })
  @ApiOkResponse({ description: 'Applications returned successfully.' })
  async getApplications(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return await this.applicationService.getApplicationsByUser(email);
  }
}
