import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationModule } from '../verification/verification.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [VerificationModule, NotificationModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
