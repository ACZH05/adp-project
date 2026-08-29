import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendAppointmentNotification(
    email: string,
    outcome: 'received' | 'approved' | 'rejected' | 'unavailable',
    appointmentId: string,
    extraDetails?: any,
  ) {
    // Stub implementation to satisfy S5-FR-09
    this.logger.log(`[STUB EMAIL] Sending email to ${email}`);
    this.logger.log(`Subject: License Collection Appointment Request ${outcome.toUpperCase()}`);
    this.logger.log(`Body: Your license collection appointment request ${appointmentId} is now ${outcome}.`);
    if (extraDetails) {
      this.logger.log(`Details: ${JSON.stringify(extraDetails)}`);
    }
  }
}
