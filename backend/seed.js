const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('Seeding eligible application...');
  await prisma.eligibleApplication.upsert({
    where: { applicationId: 'APP-2024-8992' },
    update: {},
    create: {
      applicationId: 'APP-2024-8992',
      applicantId: 'mock-applicant-123',
      isEligible: true,
    }
  });
  console.log('Done!');
}

seed().catch(console.error).finally(() => process.exit(0));
