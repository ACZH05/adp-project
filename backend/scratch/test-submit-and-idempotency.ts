import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ApplicationService } from '../src/application/application.service';
import { PrismaService } from '../src/prisma/prisma.service';

const TEST_SUBMIT_DATA = {
  fullName: 'Tan Kah Kee',
  icPassport: '750101-14-5566',
  dob: '1975-01-01',
  email: 'mpkulicense@gmail.com',
  contactNumber: '0123456789',
  residentialAddress: 'No. 123 Jalan Ampang, Kuala Lumpur',
  businessName: 'Kee Food Ventures Sdn. Bhd.',
  position: 'Managing Director',
  businessPhone: '03-99887766',
  regDate: '2024-01-01',
  expiryDate: '2027-12-31',
  regNumber: '202401998877',
  businessAddress: 'No. 45 Commercial Street, Kuala Lumpur',
  premiseAddress: 'Lot 1-02 Ground Floor, Mall Commercial Centre',
  postcode: 50450,
  cityDistrict: 'Kuala Lumpur',
  premiseType: 'Commercial Shop Lot',
  floorLevel: 'Ground',
  primaryType: 'Live Music/Band Performance',
  quantityCapacity: 150,
  quantityUnit: 'Pax/Persons',
  requestedDuration: 12,
  operatingHoursStart: 10,
  operatingHoursEnd: 22,
  signatoryName: 'Tan Kah Kee',
  signatoryIc: '750101-14-5566',
  companyName: 'Kee Food Ventures Sdn. Bhd.',
  acceptedDeclaration: true,
};

async function testSubmitFlow() {
  console.log('=== Step 1: Bootstrapping NestJS Application Context ===');
  const app = await NestFactory.createApplicationContext(AppModule);

  const applicationService = app.get(ApplicationService);
  const prisma = app.get(PrismaService);

  try {
    console.log('\n=== Step 2: Submitting Application (First Submission) ===');
    const submitResult1 = await applicationService.upsertApplication(TEST_SUBMIT_DATA as any, 'submitted');
    console.log('Submit Result 1:', submitResult1);

    console.log('\n=== Step 3: Verifying Database Records ===');
    const dbApp = await prisma.application.findUnique({
      where: { id: submitResult1.applicationId },
      include: {
        versions: {
          include: {
            verificationJobs: true,
          },
        },
      },
    });

    console.log(`Application No: ${dbApp?.applicationNo}`);
    console.log(`Application Status: ${dbApp?.status}`);
    console.log(`Version Count: ${dbApp?.versions.length}`);
    console.log(`Verification Jobs Count: ${dbApp?.versions[0]?.verificationJobs.length}`);
    console.log(`Verification Job Status: ${dbApp?.versions[0]?.verificationJobs[0]?.jobStatus}`);

    console.log('\n=== Step 4: Testing Idempotency Guard (Re-submitting Same Version) ===');
    const submitResult2 = await applicationService.upsertApplication(
      {
        ...TEST_SUBMIT_DATA,
        applicationId: submitResult1.applicationId,
        applicationVersionId: submitResult1.applicationVersionId,
      } as any,
      'submitted',
    );
    console.log('Submit Result 2 (Idempotent Attempt):', submitResult2);

    // Verify job count in DB remains 1
    const recheckedApp = await prisma.application.findUnique({
      where: { id: submitResult1.applicationId },
      include: {
        versions: {
          include: {
            verificationJobs: true,
          },
        },
      },
    });

    console.log(`Verification Jobs Count after 2nd submit attempt: ${recheckedApp?.versions[0]?.verificationJobs.length}`);

    if (recheckedApp?.versions[0]?.verificationJobs.length === 1) {
      console.log('\nSUCCESS: Idempotency Guard verified! Duplicate job enqueuing was successfully prevented.');
    } else {
      console.error('\nERROR: Duplicate job was created!');
    }

  } catch (error) {
    console.error('Test execution error:', error);
  } finally {
    await app.close();
    console.log('\nApplication context closed.');
  }
}

testSubmitFlow();
