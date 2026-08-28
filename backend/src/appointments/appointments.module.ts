import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AdminAppointmentsController } from './admin-appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma.service';

import { EmailService } from './email.service';
import { AppointmentsCronService } from './appointments-cron.service';

@Module({
  controllers: [AppointmentsController, AdminAppointmentsController],
  providers: [AppointmentsService, PrismaService, EmailService, AppointmentsCronService],
})
export class AppointmentsModule {}
