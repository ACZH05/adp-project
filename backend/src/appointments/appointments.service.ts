import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // S5-FR-02: Create appointment request
  async createAppointmentRequest(data: { applicantId: string; applicationId: string; requestedDate: Date; requestedTime: string; notes?: string }) {
    // S5-FR-01, INT-14: Check eligibility
    const eligibility = await this.prisma.eligibleApplication.findUnique({
      where: { applicationId: data.applicationId },
    });

    if (!eligibility || !eligibility.isEligible) {
      throw new BadRequestException('Application is not eligible for an appointment.');
    }
    
    // Idempotency: Check if an active request already exists for this application
    const existing = await this.prisma.appointmentRequest.findFirst({
      where: {
        applicationId: data.applicationId,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    });

    if (existing) {
      throw new BadRequestException('An active appointment request already exists for this application.');
    }

    return this.prisma.$transaction(async (prisma) => {
      const request = await prisma.appointmentRequest.create({
        data: {
          applicantId: data.applicantId,
          applicationId: data.applicationId,
          requestedDate: data.requestedDate,
          requestedTime: data.requestedTime,
          notes: data.notes,
          status: 'PENDING',
        },
      });

      // S5-FR-11: Audit trail
      await prisma.appointmentAudit.create({
        data: {
          appointmentRequestId: request.id,
          action: 'CREATED',
          performedBy: data.applicantId,
          details: 'Appointment request created',
        },
      });

      // S5-FR-09: Notify applicant
      await this.emailService.sendAppointmentNotification(
        data.applicantId,
        'Appointment Request Received',
        `Your appointment request for application ${data.applicationId} has been received and is pending review.`
      );

      return request;
    });
  }

  // S5-FR-03: View current appointment request status
  async getAppointmentStatus(applicationId: string) {
    const request = await this.prisma.appointmentRequest.findFirst({
      where: { applicationId },
      orderBy: { createdAt: 'desc' },
      include: { decisions: true }
    });

    if (!request) {
      throw new NotFoundException('No appointment request found for this application.');
    }

    return request;
  }

  // S5-FR-05: Review pending appointment requests
  async getPendingRequests() {
    return this.prisma.appointmentRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' },
    });
  }

  // S5-FR-06: Approve or reject appointment requests
  async makeDecision(id: string, decision: 'APPROVED' | 'REJECTED' | 'UNAVAILABLE', adminId: string, reason?: string) {
    const request = await this.prisma.appointmentRequest.findUnique({ where: { id } });
    if (!request) {
      throw new NotFoundException('Appointment request not found.');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Decision can only be made on pending requests.');
    }

    // Transaction for atomic update and decision logging
    return this.prisma.$transaction(async (prisma) => {
      const updatedRequest = await prisma.appointmentRequest.update({
        where: { id },
        data: { status: decision },
      });

      const decisionRecord = await prisma.appointmentDecision.create({
        data: {
          appointmentRequestId: id,
          decision,
          adminId,
          reason,
        },
      });

      // S5-FR-11: Audit trail
      await prisma.appointmentAudit.create({
        data: {
          appointmentRequestId: id,
          action: 'DECISION_UPDATED',
          performedBy: adminId || 'system',
          details: `Decision: ${decision}, Reason: ${reason || 'N/A'}`,
        },
      });

      // S5-FR-09: Send email notification
      await this.emailService.sendAppointmentNotification(
        updatedRequest.applicantId,
        `Appointment Request ${decision}`,
        `Your appointment request has been marked as ${decision}. Reason: ${reason || 'N/A'}`
      );

      // Here we would emit INT-18 events and INT-15 updates
      // e.g. emitToAnalytics(decisionRecord), notifyApplicant(updatedRequest)

      return { updatedRequest, decisionRecord };
    });
  }
}
