import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationModule } from './verification/verification.module';
import { BullModule } from '@nestjs/bullmq';
import { AppointmentsModule } from './appointments/appointments.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // BullModule.forRoot({
    //   connection: {
    //     host: process.env.REDIS_HOST ?? '127.0.0.1',
    //     port: Number(process.env.REDIS_PORT ?? 6379),
    //   },
    // }),
    // VerificationModule,
    ScheduleModule.forRoot(),
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
