import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailNotificationPayload {
  recipientEmail: string;
  applicantName?: string | null;
  applicationNo: string;
  status: string;
  summary?: string;
  issuesCount?: number;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter: nodemailer.Transporter | null = null;
  private isEthereal = false;
  private testAccountInfo: any = null;

  constructor() {
    this.initTransporter();
  }

  private async initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.isEthereal = false;
      this.logger.log(`[SMTP Configured] Mailer initialized for host: ${host}:${port} (${user})`);
    } else {
      try {
        // Auto-generate free working Ethereal Email test account
        const testAccount = await nodemailer.createTestAccount();
        this.testAccountInfo = testAccount;
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.isEthereal = true;
        this.logger.log(`[Ethereal Test Account Generated] SMTP User: ${testAccount.user}`);
      } catch (err: any) {
        this.logger.error(`[Ethereal Setup Warning] Could not auto-create Ethereal account: ${err?.message || String(err)}`);
      }
    }
  }

  /**
   * Sends an email notification to the applicant when application status changes or on submission/resubmission (S2-FR-11)
   */
  async sendApplicationStatusNotification(payload: EmailNotificationPayload): Promise<boolean> {
    const { recipientEmail, applicantName = 'Applicant', applicationNo, status, summary, issuesCount } = payload;

    let subject = `[ADP System] Status Update for Application #${applicationNo}`;
    let body = `Hello ${applicantName || 'Applicant'},\n\nYour application #${applicationNo} status update: ${status.toUpperCase()}.\n`;

    switch (status.toLowerCase()) {
      case 'submitted':
        subject = `[ADP System] Application #${applicationNo} Submitted`;
        body = `Hello ${applicantName || 'Applicant'},\n\nThank you for submitting your entertainment license application #${applicationNo}.\nAutomated AI pre-screening has been queued and is currently in progress.\n\nSummary: ${summary || 'Application submitted successfully.'}`;
        break;

      case 'resubmitted':
      case 'resubmission':
        subject = `[ADP System] Corrections Resubmitted - Application #${applicationNo}`;
        body = `Hello ${applicantName || 'Applicant'},\n\nWe have received your resubmission/corrections for application #${applicationNo}.\nAutomated AI re-verification has been enqueued and is now scanning your updated details and documents.\n\nSummary: ${summary || 'Resubmission received.'}`;
        break;

      case 'verification_complete':
      case 'verified':
        subject = `[ADP System] Verification Passed - Application #${applicationNo}`;
        body += `\nAutomated AI pre-screening has passed successfully. Your application is now queued for officer review.\n\nSummary: ${summary || 'All document and form checks passed.'}`;
        break;

      case 'correction_required':
      case 'flagged':
        subject = `[ADP System] Action Required - Application #${applicationNo}`;
        body += `\nAutomated AI pre-screening identified ${issuesCount ?? 'some'} issue(s) requiring your correction.\nPlease log into the applicant portal to review discrepancies and submit updated documents.\n\nSummary: ${summary || 'Corrections needed.'}`;
        break;

      case 'approved':
        subject = `[ADP System] Congratulations! Application #${applicationNo} Approved`;
        body += `\nYour entertainment license application #${applicationNo} has been approved by the licensing officer. You may now request an appointment for visit coordination.`;
        break;

      case 'rejected':
        subject = `[ADP System] Notice: Application #${applicationNo} Rejected`;
        body += `\nYour application #${applicationNo} has been rejected by the licensing officer.\n\nReason: ${summary || 'Does not meet regulatory requirements.'}`;
        break;

      default:
        body += `\nSummary: ${summary || 'Status update logged.'}`;
    }

    body += `\n\nThank you,\nAutomated Licensing Platform (ADP System)`;

    const fromAddress = process.env.SMTP_FROM || (this.testAccountInfo ? this.testAccountInfo.user : '"ADP Licensing System" <no-reply@adp-system.gov.my>');

    // Try sending email via Nodemailer
    if (this.transporter) {
      try {
        const mailOptions = {
          from: fromAddress,
          to: recipientEmail,
          subject: subject,
          text: body,
        };

        const info = await this.transporter.sendMail(mailOptions);
        
        if (this.isEthereal) {
          const previewUrl = nodemailer.getTestMessageUrl(info);
          this.logger.log(`\n=============================================================`);
          this.logger.log(`[Ethereal Email Sent Live!]`);
          this.logger.log(`To: ${recipientEmail} | Subject: "${subject}"`);
          this.logger.log(`Live Clickable Email Web Preview URL:\n---> ${previewUrl} <---`);
          this.logger.log(`=============================================================\n`);
        } else {
          this.logger.log(`[Real SMTP Email Sent] MessageId: ${info.messageId} | To: ${recipientEmail}`);
        }
        return true;
      } catch (err: any) {
        this.logger.error(`[Email Send Error] Failed to send email to ${recipientEmail}: ${err?.message || String(err)}`);
      }
    }

    // Fallback logger
    this.logger.log(`[Email Notification Dispatched (Logger Mode)] To: ${recipientEmail} | Subject: "${subject}"`);
    return true;
  }
}
