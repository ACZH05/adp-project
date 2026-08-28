import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class AppointmentsCronService {
  private readonly logger = new Logger(AppointmentsCronService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Run every hour to check for expiring appointments
  @Cron(CronExpression.EVERY_HOUR)
  async checkExpiringAppointments() {
    this.logger.log('Checking for expiring pending appointment requests...');

    // S5-FR-08: If pending appointment request has no admin/officer action by 1 day before
    // the requested appointment time, mark as UNAVAILABLE and notify applicant.
    
    // We want to find requests where requestedDate <= tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expiringRequests = await this.prisma.appointmentRequest.findMany({
      where: {
        status: 'PENDING',
        requestedDate: {
          lte: tomorrow,
        },
      },
    });

    for (const request of expiringRequests) {
      await this.prisma.$transaction(async (prisma) => {
        const updated = await prisma.appointmentRequest.update({
          where: { id: request.id },
          data: { status: 'UNAVAILABLE' },
        });

        // Audit Trail (S5-FR-11)
        await prisma.appointmentAudit.create({
          data: {
            appointmentRequestId: updated.id,
            action: 'STATUS_TRANSITION',
            performedBy: 'system',
            details: 'Automatically marked as UNAVAILABLE due to no action 1 day before appointment',
          },
        });

        // Email Notification (S5-FR-09)
        await this.emailService.sendAppointmentNotification(
          updated.applicantId,
          'Appointment Request Unavailable',
          `Your appointment request for application ${updated.applicationId} scheduled for ${updated.requestedDate.toISOString()} is unavailable as no officer could review it in time.`
        );
        
        this.logger.log(`Marked appointment request ${updated.id} as UNAVAILABLE`);
      });
    }
  }
}
