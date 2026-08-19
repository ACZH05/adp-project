import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [VerificationModule],
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
