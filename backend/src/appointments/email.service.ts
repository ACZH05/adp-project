import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendAppointmentNotification(to: string, subject: string, body: string) {
    // S5-FR-09: Send email notifications for appointment request received, approved, rejected, and unavailable outcomes.
    // In a real application, this would integrate with an email provider like SendGrid, AWS SES, etc.
    this.logger.log(`Mock sending email to ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log(`Body: ${body}`);
  }
}
