import 'dotenv/config';
import { PrismaClient, Role, ApplicationStatus, PremiseType, FloorLevel, EntertainmentType, OfficerDecisionType, KpiEventType, VerificationOverallResult, VerificationJobStatus } from '../generated/prisma/client';
import pkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('supabase.com') ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Subsystem S4 test data...');

  // 1. Create or upsert users
  const applicantUser = await prisma.user.upsert({
    where: { email: 'applicant@example.com' },
    update: {},
    create: {
      email: 'applicant@example.com',
      passwordHash: 'seeded_password_hash_applicant',
      fullName: 'Ahmad bin Zulkifli',
      role: Role.applicant,
    },
  });

  const officerUser = await prisma.user.upsert({
    where: { email: 'officer@example.com' },
    update: {
      fullName: 'Officer Tan (Senior Reviewer)',
    },
    create: {
      email: 'officer@example.com',
      passwordHash: 'seeded_password_hash_officer',
      fullName: 'Officer Tan (Senior Reviewer)',
      role: Role.officer,
    },
  });

  // 2. Create Application 1 (pending officer review)
  const existingApp1 = await prisma.application.findUnique({
    where: { applicationNo: 'APP-2026-0001' },
  });

  let app1 = existingApp1;

  if (!existingApp1) {
    app1 = await prisma.application.create({
      data: {
        applicationNo: 'APP-2026-0001',
        applicantUserId: applicantUser.id,
        status: ApplicationStatus.pending_officer_review,
        applicantFullName: 'Ahmad bin Zulkifli',
        applicantIcNo: '900101-14-5555',
        businessName: 'Melody Family Karaoke',
        businessRegistrationNo: '202601009988',
        premiseAddress: 'Lot 102, Level 2, Sunway Pyramid, Petaling Jaya',
        premiseType: PremiseType.mall,
        floorLevel: FloorLevel.upper,
        entertainmentType: EntertainmentType.karaoke,
        submittedAt: new Date(Date.now() - 3600000 * 24),
      },
    });

    const version1 = await prisma.applicationVersion.create({
      data: {
        applicationId: app1.id,
        versionNumber: 1,
        formSnapshot: {
          applicantName: 'Ahmad bin Zulkifli',
          businessName: 'Melody Family Karaoke',
        },
      },
    });

    await prisma.application.update({
      where: { id: app1.id },
      data: { currentApplicationVersionId: version1.id },
    });

    const job1 = await prisma.verificationJob.create({
      data: {
        applicationVersionId: version1.id,
        bullmqJobId: 'bullmq-job-001',
        jobStatus: VerificationJobStatus.success,
        attemptCount: 1,
        queuedAt: new Date(Date.now() - 3600000 * 24),
        startedAt: new Date(Date.now() - 3600000 * 23.9),
        completedAt: new Date(Date.now() - 3600000 * 23.8),
      },
    });

    await prisma.verificationReport.create({
      data: {
        verificationJobId: job1.id,
        confidenceScore: 0.92,
        overallResult: VerificationOverallResult.passed,
        summary: 'All required documents present and valid.',
        modelVersion: 'v1.2.0',
        promptPolicyVersion: 'p1.0.0',
        rawResult: { status: 'passed' },
      },
    });

    await prisma.kpiEvent.createMany({
      data: [
        {
          eventType: KpiEventType.application_submitted,
          applicationId: app1.id,
          occurredAt: new Date(Date.now() - 3600000 * 24),
        },
        {
          eventType: KpiEventType.verification_completed,
          applicationId: app1.id,
          verificationJobId: job1.id,
          queueWaitMs: 1200,
          aiProcessingMs: 4500,
          retryCount: 0,
          isDeadLetter: false,
          occurredAt: new Date(Date.now() - 3600000 * 23.8),
        },
      ],
    });
  }

  // 3. Create Application 2 (approved case)
  const existingApp2 = await prisma.application.findUnique({
    where: { applicationNo: 'APP-2026-0002' },
  });

  if (!existingApp2) {
    const app2 = await prisma.application.create({
      data: {
        applicationNo: 'APP-2026-0002',
        applicantUserId: applicantUser.id,
        status: ApplicationStatus.approved,
        applicantFullName: 'Ahmad bin Zulkifli',
        applicantIcNo: '900101-14-5555',
        businessName: 'Rock Arena Live Club',
        businessRegistrationNo: '202601007766',
        premiseAddress: 'No 15, Jalan Telawi, Bangsar, Kuala Lumpur',
        premiseType: PremiseType.corner_shop,
        floorLevel: FloorLevel.ground,
        entertainmentType: EntertainmentType.live_band,
        submittedAt: new Date(Date.now() - 3600000 * 48),
        decidedAt: new Date(Date.now() - 3600000 * 12),
      },
    });

    const version2 = await prisma.applicationVersion.create({
      data: {
        applicationId: app2.id,
        versionNumber: 1,
        formSnapshot: {
          applicantName: 'Ahmad bin Zulkifli',
          businessName: 'Rock Arena Live Club',
        },
      },
    });

    await prisma.application.update({
      where: { id: app2.id },
      data: { currentApplicationVersionId: version2.id },
    });

    await prisma.officerDecision.create({
      data: {
        applicationId: app2.id,
        applicationVersionId: version2.id,
        officerUserId: officerUser.id,
        decisionType: OfficerDecisionType.approved,
        officerNote: 'All safety and noise guidelines met.',
        decidedAt: new Date(Date.now() - 3600000 * 12),
      },
    });

    await prisma.kpiEvent.create({
      data: {
        eventType: KpiEventType.approved,
        applicationId: app2.id,
        officerProcessingMs: 3600000 * 36,
        isIncomplete: false,
        occurredAt: new Date(Date.now() - 3600000 * 12),
      },
    });
  }

  // 4. Create Application 3 (verification_complete / AI-Ready)
  const existingApp3 = await prisma.application.findUnique({
    where: { applicationNo: 'APP-2026-0003' },
  });

  if (!existingApp3) {
    const app3 = await prisma.application.create({
      data: {
        applicationNo: 'APP-2026-0003',
        applicantUserId: applicantUser.id,
        status: ApplicationStatus.verification_complete,
        applicantFullName: 'Tan Kah Kee',
        applicantIcNo: '880505-01-6789',
        businessName: 'Starline Cinema & Lounge',
        businessRegistrationNo: '202601005544',
        premiseAddress: 'Level 4, JB City Square, Johor Bahru',
        premiseType: PremiseType.mall,
        floorLevel: FloorLevel.upper,
        entertainmentType: EntertainmentType.cinema,
        submittedAt: new Date(Date.now() - 3600000 * 18),
      },
    });

    const version3 = await prisma.applicationVersion.create({
      data: {
        applicationId: app3.id,
        versionNumber: 1,
        formSnapshot: {
          applicantName: 'Tan Kah Kee',
          businessName: 'Starline Cinema & Lounge',
        },
      },
    });

    await prisma.application.update({
      where: { id: app3.id },
      data: { currentApplicationVersionId: version3.id },
    });

    const job3 = await prisma.verificationJob.create({
      data: {
        applicationVersionId: version3.id,
        bullmqJobId: 'bullmq-job-003',
        jobStatus: VerificationJobStatus.success,
        attemptCount: 1,
        queuedAt: new Date(Date.now() - 3600000 * 18),
        startedAt: new Date(Date.now() - 3600000 * 17.9),
        completedAt: new Date(Date.now() - 3600000 * 17.8),
      },
    });

    await prisma.verificationReport.create({
      data: {
        verificationJobId: job3.id,
        confidenceScore: 0.88,
        overallResult: VerificationOverallResult.passed,
        summary: 'PBT license and premis layout verified successfully.',
        modelVersion: 'v1.2.0',
        promptPolicyVersion: 'p1.0.0',
        rawResult: { status: 'passed' },
      },
    });
  }

  // 5. Create Application 4 (manual_prescreening_required / Flagged)
  const existingApp4 = await prisma.application.findUnique({
    where: { applicationNo: 'APP-2026-0004' },
  });

  if (!existingApp4) {
    const app4 = await prisma.application.create({
      data: {
        applicationNo: 'APP-2026-0004',
        applicantUserId: applicantUser.id,
        status: ApplicationStatus.manual_prescreening_required,
        applicantFullName: 'Sarah Lim Wei Ling',
        applicantIcNo: '950212-10-4321',
        businessName: 'Cyber Esports & Arcade',
        businessRegistrationNo: '202601003322',
        premiseAddress: 'No 88, Jalan Sutera Utama, Skudai, Johor',
        premiseType: PremiseType.middle_shop,
        floorLevel: FloorLevel.ground,
        entertainmentType: EntertainmentType.amusement,
        submittedAt: new Date(Date.now() - 3600000 * 10),
      },
    });

    const version4 = await prisma.applicationVersion.create({
      data: {
        applicationId: app4.id,
        versionNumber: 1,
        formSnapshot: {
          applicantName: 'Sarah Lim Wei Ling',
          businessName: 'Cyber Esports & Arcade',
        },
      },
    });

    await prisma.application.update({
      where: { id: app4.id },
      data: { currentApplicationVersionId: version4.id },
    });

    const job4 = await prisma.verificationJob.create({
      data: {
        applicationVersionId: version4.id,
        bullmqJobId: 'bullmq-job-004',
        jobStatus: VerificationJobStatus.success,
        attemptCount: 1,
        queuedAt: new Date(Date.now() - 3600000 * 10),
        startedAt: new Date(Date.now() - 3600000 * 9.9),
        completedAt: new Date(Date.now() - 3600000 * 9.8),
      },
    });

    await prisma.verificationReport.create({
      data: {
        verificationJobId: job4.id,
        confidenceScore: 0.45,
        overallResult: VerificationOverallResult.issues_found,
        summary: 'Fire safety certificate blur issue. Manual inspection required.',
        modelVersion: 'v1.2.0',
        promptPolicyVersion: 'p1.0.0',
        rawResult: { status: 'flagged' },
      },
    });
  }

  // 6. Create Application 5 (High confidence pending review)
  const existingApp5 = await prisma.application.findUnique({
    where: { applicationNo: 'APP-2026-0005' },
  });

  if (!existingApp5) {
    const app5 = await prisma.application.create({
      data: {
        applicationNo: 'APP-2026-0005',
        applicantUserId: applicantUser.id,
        status: ApplicationStatus.pending_officer_review,
        applicantFullName: 'Kumar A/L Raj',
        applicantIcNo: '851120-01-9988',
        businessName: 'Golden Bistro & Live Music',
        businessRegistrationNo: '202601001199',
        premiseAddress: 'Lot 12, Ground Floor, Mid Valley Southkey, Johor Bahru',
        premiseType: PremiseType.mall,
        floorLevel: FloorLevel.ground,
        entertainmentType: EntertainmentType.live_band,
        submittedAt: new Date(Date.now() - 3600000 * 5),
      },
    });

    const version5 = await prisma.applicationVersion.create({
      data: {
        applicationId: app5.id,
        versionNumber: 1,
        formSnapshot: {
          applicantName: 'Kumar A/L Raj',
          businessName: 'Golden Bistro & Live Music',
        },
      },
    });

    await prisma.application.update({
      where: { id: app5.id },
      data: { currentApplicationVersionId: version5.id },
    });

    const job5 = await prisma.verificationJob.create({
      data: {
        applicationVersionId: version5.id,
        bullmqJobId: 'bullmq-job-005',
        jobStatus: VerificationJobStatus.success,
        attemptCount: 1,
        queuedAt: new Date(Date.now() - 3600000 * 5),
        startedAt: new Date(Date.now() - 3600000 * 4.9),
        completedAt: new Date(Date.now() - 3600000 * 4.8),
      },
    });

    await prisma.verificationReport.create({
      data: {
        verificationJobId: job5.id,
        confidenceScore: 0.95,
        overallResult: VerificationOverallResult.passed,
        summary: 'All documents clear and verified. High confidence score.',
        modelVersion: 'v1.2.0',
        promptPolicyVersion: 'p1.0.0',
        rawResult: { status: 'passed' },
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
