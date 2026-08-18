import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VerificationJobPayloadDto } from './dto/verification-job-payload.dto';
import { VerificationService } from './verification.service';

@ApiTags('verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) { }

  @Post('enqueue')
  @ApiOperation({ summary: 'Queue an application verification job' })
  @ApiBody({ type: VerificationJobPayloadDto })
  @ApiCreatedResponse({ description: 'Verification job queued.' })
  async enqueuePayload(@Body() payload: VerificationJobPayloadDto) {
    return await this.verificationService.enqueueVerificationJob(payload);
  }
}
