import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { BullModule } from '@nestjs/bullmq';
import { VerificationConsumer } from './verification.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'verification',
    }),
  ],
  controllers: [VerificationController],
  providers: [VerificationService, VerificationConsumer],
  exports: [VerificationService],
})
export class VerificationModule {}
