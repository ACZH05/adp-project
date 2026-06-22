import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { VerificationJobPayload } from './types/verificationJobPayloadType';

@Injectable()
export class VerificationService {
  constructor(@InjectQueue('verification') private verificationQueue: Queue) {}
  async enqueueVerificationJob(payload: VerificationJobPayload) {
    return this.verificationQueue.add('verify-application', payload);
  }
}
