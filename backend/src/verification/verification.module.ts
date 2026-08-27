import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { BullModule } from '@nestjs/bullmq';
import { VerificationConsumer } from './verification.processor';
import { SupabaseModule } from '../supabase/supabase.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    SupabaseModule,
    BullModule.registerQueue({
      name: 'verification',
    }),
  ],
  controllers: [VerificationController],
  providers: [VerificationService, VerificationConsumer, PrismaService],
  exports: [VerificationService],
})
export class VerificationModule {}
