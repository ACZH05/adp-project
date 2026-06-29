import { Body, Controller, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';
import type { VerificationJobPayload } from './types/verificationJobPayloadType';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('enqueue')
  async enqueuePayload(@Body() payload: VerificationJobPayload) {
    return await this.verificationService.enqueueVerificationJob(payload);
  }
}
