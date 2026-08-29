import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationService } from './notification.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApplicationStatus, AppointmentStatus, AuditAction, KpiEventType } from '../../generated/prisma/client';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly notificationService: NotificationService,
  ) {}

  // S5-FR-02: Get predefined time slots (e.g. 9am - 4pm) for physical visit coordination (S5-NFR-02)
  getAvailableSlots(dateStr: string) {
    // Basic slot generator for the given date
    const slots: { startAt: string; endAt: string }[] = [];
    const date = new Date(dateStr);
    date.setHours(9, 0, 0, 0); // start at 9am
    
    // Generate 30 min slots until 4pm
    for (let i = 0; i < 14; i++) {
      const start = new Date(date);
      start.setMinutes(start.getMinutes() + (i * 30));
      
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);
      
      slots.push({
        startAt: start.toISOString(),
        endAt: end.toISOString(),
      });
    }
    
    return slots;
  }

  // S5-FR-01: Eligibility check
  async getEligibleApplications(applicantUserId: string) {
    return this.prisma.application.findMany({
      where: {
        applicantUserId,
        status: ApplicationStatus.approved,
      },
    });
  }

  // S5-FR-01: Eligibility check is done by finding approved application
  async requestAppointment(applicantUserId: string, applicationId: string, preferredStartAt: string, preferredEndAt: string, ipAddress?: string, userAgent?: string) {
    const application = await this.prisma.application.findFirst({
      where: {
        id: applicationId,
        applicantUserId,
        status: ApplicationStatus.approved,
      },
    });

    if (!application) {
      throw new BadRequestException('Application is not eligible for appointment scheduling.');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        applicationId,
        applicantUserId,
        preferredStartAt: new Date(preferredStartAt),
        preferredEndAt: new Date(preferredEndAt),
        status: AppointmentStatus.pending,
      },
      include: {
        applicant: true,
      }
    });

    // S5-FR-11: Audit log
    await this.auditService.log({
      actorUserId: applicantUserId,
      action: AuditAction.appointment_requested,
      targetEntityType: 'Appointment',
      targetEntityId: appointment.id,
      ipAddress,
      userAgent,
    });

    await this.prisma.kpiEvent.create({
      data: {
        applicationId,
        eventType: KpiEventType.appointment_requested,
      }
    });

    // S5-FR-09: Notification
    await this.notificationService.sendAppointmentNotification(
      appointment.applicant.email,
      'received',
      appointment.id
    );
    await this.auditService.log({
      action: AuditAction.notification_sent,
      targetEntityType: 'Appointment',
      targetEntityId: appointment.id,
      metadata: { type: 'received', to: appointment.applicant.email },
    });

    return appointment;
  }

  async getApplicantAppointments(applicantUserId: string) {
    return this.prisma.appointment.findMany({
      where: { applicantUserId },
      include: { application: true },
      orderBy: { requestedAt: 'desc' },
    });
  }

  // S5-FR-05: Review pending appointment requests
  async getPendingRequests() {
    return this.prisma.appointment.findMany({
      where: { status: AppointmentStatus.pending },
      include: { application: true, applicant: true },
      orderBy: { requestedAt: 'asc' },
    });
  }

  // S5-FR-06: Approve or reject
  async decideAppointment(appointmentId: string, officerId: string, decision: 'approve' | 'reject', reason?: string, ipAddress?: string, userAgent?: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { applicant: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // S5-NFR-01: Idempotency Guard
    if (appointment.status !== AppointmentStatus.pending) {
      throw new ConflictException(`Appointment is already ${appointment.status}`);
    }

    const newStatus = decision === 'approve' ? AppointmentStatus.approved : AppointmentStatus.rejected;

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: newStatus,
        decidedByUserId: officerId,
        decisionReason: reason,
        decidedAt: new Date(),
        scheduledStartAt: decision === 'approve' ? appointment.preferredStartAt : null,
        scheduledEndAt: decision === 'approve' ? appointment.preferredEndAt : null,
      },
    });

    // S5-FR-07 & S5-FR-11: Audit log
    await this.auditService.log({
      actorUserId: officerId,
      action: AuditAction.appointment_decision,
      targetEntityType: 'Appointment',
      targetEntityId: appointment.id,
      ipAddress,
      userAgent,
      metadata: { decision, reason },
    });

    await this.prisma.kpiEvent.create({
      data: {
        applicationId: appointment.applicationId,
        eventType: KpiEventType.appointment_decided,
      }
    });

    // S5-FR-09: Notification
    await this.notificationService.sendAppointmentNotification(
      appointment.applicant.email,
      decision === 'approve' ? 'approved' : 'rejected',
      appointment.id,
      { reason }
    );
    await this.auditService.log({
      action: AuditAction.notification_sent,
      targetEntityType: 'Appointment',
      targetEntityId: appointment.id,
      metadata: { type: decision, to: appointment.applicant.email },
    });

    return updated;
  }

  // S5-FR-08: Automatic expiry
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpirations() {
    this.logger.log('Checking for expiring appointment requests...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expiring = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.pending,
        preferredStartAt: {
          lte: tomorrow,
        },
      },
      include: { applicant: true },
    });

    for (const appt of expiring) {
      await this.prisma.appointment.update({
        where: { id: appt.id },
        data: { status: AppointmentStatus.unavailable },
      });

      // S5-FR-11: Audit
      await this.auditService.log({
        action: AuditAction.appointment_expired,
        targetEntityType: 'Appointment',
        targetEntityId: appt.id,
        metadata: { reason: 'No action 1 day before' },
      });

      // S5-FR-09: Notify applicant
      await this.notificationService.sendAppointmentNotification(
        appt.applicant.email,
        'unavailable',
        appt.id,
        { message: 'No admin was available for this requested time slot.' }
      );
      await this.auditService.log({
        action: AuditAction.notification_sent,
        targetEntityType: 'Appointment',
        targetEntityId: appt.id,
        metadata: { type: 'unavailable', to: appt.applicant.email },
      });
    }

    if (expiring.length > 0) {
      this.logger.log(`Expired ${expiring.length} appointments.`);
    }
  }
}
