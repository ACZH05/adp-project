import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { VerificationConsumer } from './verification.processor';
import { BullModule } from '@nestjs/bullmq';
import { SupabaseModule } from '../supabase/supabase.module';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    SupabaseModule,
    NotificationModule,
    BullModule.registerQueue({
      name: 'verification',
    }),
  ],
  controllers: [VerificationController],
  providers: [VerificationService, VerificationConsumer, PrismaService],
  exports: [VerificationService],
})
export class VerificationModule {}
