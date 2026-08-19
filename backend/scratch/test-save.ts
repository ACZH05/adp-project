import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ApplicationService } from '../src/application/application.service';
import { PrismaService } from '../src/prisma/prisma.service';

const FORM_DATA = {
  fullName: "Test User",
  icPassport: "A1234567",
  dob: "1990-01-01",
  email: "test_temp_user@example.com",
  contactNumber: "0123456789",
  residentialAddress: "1 Test Road",
  businessName: "Test Business",
  position: "Owner",
  businessPhone: "0312345678",
  regDate: "2026-01-01",
  expiryDate: "2027-01-01",
  regNumber: "REG123",
  businessAddress: "2 Business Road",
  premiseAddress: "3 Premise Road",
  postcode: 50000,
  cityDistrict: "Kuala Lumpur",
  premiseType: "Commercial Shop Lot",
  floorLevel: "Ground",
  primaryType: "Live Music/Band Performance",
  quantityCapacity: 100,
  quantityUnit: "Pax/Persons",
  requestedDuration: 12,
  operatingHoursStart: 10,
  operatingHoursEnd: 22,
  signatoryName: "Test User",
  signatoryIc: "A1234567",
  companyName: "Test Business Sdn Bhd",
  acceptedDeclaration: true,
};

async function test() {
  console.log('Bootstrapping NestJS application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const applicationService = app.get(ApplicationService);
  const prisma = app.get(PrismaService);

  try {
    console.log('Attempting to save draft application...');
    const result = await applicationService.upsertApplication(FORM_DATA as any, 'draft');
    console.log('Draft save result:', result);

    // Verify in database
    console.log('Querying database to confirm records...');
    const dbApp = await prisma.application.findUnique({
      where: { id: result.applicationId },
      include: {
        currentApplicationVersion: true,
      }
    });
    
    console.log('Saved Application in DB:', JSON.stringify(dbApp, null, 2));
    
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    await app.close();
  }
}

test();
