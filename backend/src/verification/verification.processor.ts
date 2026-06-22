import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('verification')
export class VerificationConsumer extends WorkerHost {
  async process(job: Job<any, void, string>) {
    switch (job.name) {
      case 'verify-application': {
        console.log('Job Data :', job);
      }
    }
  }
}
