import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { NotificationService } from '../src/appointment/notification.service';
import { AppointmentService } from '../src/appointment/appointment.service';
import { ApplicationStatus } from '../generated/prisma/client';

describe('S1 & S5 Integration Test Suite (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let appointmentService: AppointmentService;
  let notificationService: NotificationService;

  let applicantToken: string;
  let adminToken: string;
  let applicantId: string;
  let adminId: string;
  let testAppId: string;
  let testAppointmentId: string;

  const applicantEmail = `applicant_${Date.now()}@test.com`;
  const adminEmail = `admin_${Date.now()}@test.com`;
  const password = 'Password123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    appointmentService = app.get<AppointmentService>(AppointmentService);
    notificationService = app.get<NotificationService>(NotificationService);
    // Cleanup any left-over data from previous failed runs
    await prisma.adminInvitation.deleteMany({ where: { email: adminEmail } });
    await prisma.user.deleteMany({ where: { email: 'superadmin@example.com' } });
    await prisma.user.deleteMany({ where: { email: adminEmail } });
    await prisma.user.deleteMany({ where: { email: applicantEmail } });

    // Seed the admin invitation so admin can register
    await prisma.adminInvitation.create({
      data: {
        email: adminEmail,
        role: 'admin',
        expiresAt: new Date(Date.now() + 86400000), // tomorrow
        tokenHash: `dummy-token-hash-${Date.now()}`,
        invitedByUser: {
          create: {
            email: 'superadmin_' + Date.now() + '@test.com',
            passwordHash: `dummy-hash-${Date.now()}`,
            role: 'admin',
            fullName: 'Super Admin'
          }
        }
      }
    });
  });

  afterAll(async () => {
    // Cleanup created data
    if (testAppointmentId) {
      await prisma.appointment.deleteMany({ where: { id: testAppointmentId } });
    }
    await prisma.appointment.deleteMany({ where: { applicantUserId: applicantId } });
    
    if (testAppId) {
      await prisma.application.deleteMany({ where: { id: testAppId } });
    }
    await prisma.application.deleteMany({ where: { applicantUserId: applicantId } });

    if (applicantId) {
      await prisma.user.deleteMany({ where: { id: applicantId } });
    }
    if (adminId) {
      await prisma.user.deleteMany({ where: { id: adminId } });
    }
    await prisma.adminInvitation.deleteMany({ where: { email: adminEmail } });
    await app.close();
  });

  describe('S1: Authentication & RBAC', () => {
    it('should register a new applicant', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: applicantEmail,
          password,
          firstName: 'Test',
          lastName: 'Applicant'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.role).toBe('applicant');
      applicantId = res.body.user.id;
    });

    it('should login the applicant and return JWT', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: applicantEmail,
          password
        });
      
      expect(res.status).toBe(200);
      expect(res.body.access_token).toBeDefined();
      applicantToken = res.body.access_token;
    });

    it('should register an admin from invited email', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: adminEmail,
          password,
          firstName: 'Test',
          lastName: 'Admin',
          role: 'admin'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('admin');
      adminId = res.body.user.id;
    });

    it('should login the admin and return JWT', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: adminEmail,
          password
        });
      
      expect(res.status).toBe(200);
      expect(res.body.access_token).toBeDefined();
      adminToken = res.body.access_token;
    });

    it('should deny applicant access to officer endpoints (RBAC check)', async () => {
      const res = await request(app.getHttpServer())
        .get('/appointments/officer/pending')
        .set('Authorization', `Bearer ${applicantToken}`);
      
      expect(res.status).toBe(403);
    });
  });

  describe('S5: Appointment Scheduling', () => {
    it('should block appointment request if application is not approved', async () => {
      // Seed a draft application
      const unapprovedApp = await prisma.application.create({
        data: {
          applicantUserId: applicantId,
          status: ApplicationStatus.draft,
          applicationNo: `APP-${Date.now()}`
        }
      });

      const res = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({
          applicationId: unapprovedApp.id,
          startAt: new Date().toISOString(),
          endAt: new Date().toISOString()
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('not eligible');

      await prisma.application.delete({ where: { id: unapprovedApp.id } });
    });

    it('should allow appointment request for approved application (License Collection)', async () => {
      // Seed an approved application
      const approvedApp = await prisma.application.create({
        data: {
          applicantUserId: applicantId,
          status: ApplicationStatus.approved,
          applicationNo: `APP-APV-${Date.now()}`
        }
      });
      testAppId = approvedApp.id;

      // Spy on notification
      const notifySpy = jest.spyOn(notificationService, 'sendAppointmentNotification');

      const startAt = new Date();
      startAt.setDate(startAt.getDate() + 2); // 2 days from now
      const endAt = new Date(startAt);
      endAt.setHours(endAt.getHours() + 1);

      const res = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${applicantToken}`)
        .send({
          applicationId: testAppId,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString()
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('pending');
      testAppointmentId = res.body.id;

      // Verify notification triggered for 'received'
      expect(notifySpy).toHaveBeenCalledWith(applicantEmail, 'received', testAppointmentId);
      
      // Verify audit log created
      const auditLog = await prisma.auditLog.findFirst({
        where: { targetEntityId: testAppointmentId, action: 'appointment_requested' }
      });
      expect(auditLog).toBeDefined();
      expect(auditLog?.actorUserId).toBe(applicantId);
    });

    it('should allow applicant to view their appointment status', async () => {
      const res = await request(app.getHttpServer())
        .get('/appointments/applicant')
        .set('Authorization', `Bearer ${applicantToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.find((a: any) => a.id === testAppointmentId)).toBeDefined();
    });

    it('should allow admin to retrieve pending requests', async () => {
      const res = await request(app.getHttpServer())
        .get('/appointments/officer/pending')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.find((a: any) => a.id === testAppointmentId)).toBeDefined();
    });

    it('should allow admin to approve the appointment', async () => {
      const notifySpy = jest.spyOn(notificationService, 'sendAppointmentNotification');

      const res = await request(app.getHttpServer())
        .patch(`/appointments/officer/${testAppointmentId}/decision`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          decision: 'approve',
          reason: 'Slot available'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('approved');
      expect(res.body.decidedByUserId).toBe(adminId);

      // Verify notification triggered for 'approved'
      expect(notifySpy).toHaveBeenCalledWith(applicantEmail, 'approved', testAppointmentId, { reason: 'Slot available' });

      // Verify audit log
      const auditLog = await prisma.auditLog.findFirst({
        where: { targetEntityId: testAppointmentId, action: 'appointment_decision' }
      });
      expect(auditLog).toBeDefined();
      expect(auditLog?.actorUserId).toBe(adminId);
    });

    it('should simulate time-lapse and mark neglected pending appointments as unavailable', async () => {
      // Create a pending appointment that is "neglected" (scheduled for tomorrow)
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 12); // Less than 1 day from now

      const expiringAppointment = await prisma.appointment.create({
        data: {
          applicationId: testAppId,
          applicantUserId: applicantId,
          preferredStartAt: tomorrow,
          preferredEndAt: tomorrow,
          status: 'pending',
        }
      });

      const notifySpy = jest.spyOn(notificationService, 'sendAppointmentNotification');

      // Direct trigger of Cron method
      await appointmentService.handleExpirations();

      // Verify DB status
      const updated = await prisma.appointment.findUnique({
        where: { id: expiringAppointment.id }
      });
      expect(updated?.status).toBe('unavailable');

      // Verify notification sent
      expect(notifySpy).toHaveBeenCalledWith(
        applicantEmail,
        'unavailable',
        expiringAppointment.id,
        expect.any(Object)
      );

      // Cleanup
      await prisma.appointment.delete({ where: { id: expiringAppointment.id } });
    });
  });
});
