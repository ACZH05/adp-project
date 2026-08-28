const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const http = require('http');

require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8082,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log('Cleaning up previous state...');
  await prisma.$executeRawUnsafe('DELETE FROM "AppointmentAudit"');
  await prisma.$executeRawUnsafe('DELETE FROM "AppointmentDecision"');
  await prisma.$executeRawUnsafe('DELETE FROM "AppointmentRequest"');
  await prisma.$executeRawUnsafe('DELETE FROM "EligibleApplication"');

  console.log('Seeding mock eligible application...');
  await prisma.eligibleApplication.upsert({
    where: { applicationId: 'test-app-123' },
    update: {},
    create: {
      applicationId: 'test-app-123',
      applicantId: 'applicant-1',
      isEligible: true,
    }
  });

  console.log('\n--- 1. Testing without auth (should fail with 401) ---');
  let res = await request('/appointments', 'POST', {
    applicantId: 'applicant-1', applicationId: 'test-app-123', requestedDate: '2026-09-01T00:00:00Z', requestedTime: '10:00 AM'
  });
  console.log('Status:', res.status, 'Response:', res.data);

  console.log('\n--- 2. Testing with auth but application not eligible (should fail with 400) ---');
  res = await request('/appointments', 'POST', {
    applicantId: 'applicant-1', applicationId: 'uneligible-app', requestedDate: '2026-09-01T00:00:00Z', requestedTime: '10:00 AM'
  }, 'mock-applicant-token');
  console.log('Status:', res.status, 'Response:', res.data);

  console.log('\n--- 3. Testing with auth and eligible application (should succeed with 201) ---');
  res = await request('/appointments', 'POST', {
    applicantId: 'applicant-1', applicationId: 'test-app-123', requestedDate: '2026-09-01T00:00:00Z', requestedTime: '10:00 AM'
  }, 'mock-applicant-token');
  console.log('Status:', res.status, 'Response:', res.data);
  
  if (res.status === 201) {
    console.log('\n--- 4. Testing viewing appointment status (should succeed with 200) ---');
    res = await request('/appointments/test-app-123/status', 'GET', null, 'mock-applicant-token');
    console.log('Status:', res.status, 'Response:', res.data);
    
    const appointmentId = res.data.id;

    console.log('\n--- 5. Testing admin viewing pending requests (should succeed with 200) ---');
    res = await request('/admin/appointments', 'GET', null, 'mock-admin-token');
    console.log('Status:', res.status, 'Response:', res.data);
    
    console.log('\n--- 6. Testing admin approving appointment (should succeed with 201) ---');
    res = await request(`/admin/appointments/${appointmentId}/decision`, 'POST', {
      decision: 'APPROVED', adminId: 'admin-1', reason: 'Looks good'
    }, 'mock-admin-token');
    console.log('Status:', res.status, 'Response:', res.data);
  }

  // Cleanup
  await prisma.$executeRawUnsafe('DELETE FROM "AppointmentAudit"');
  await prisma.$executeRawUnsafe('DELETE FROM "AppointmentDecision"');
  await prisma.$executeRawUnsafe('DELETE FROM "AppointmentRequest"');
  await prisma.$executeRawUnsafe('DELETE FROM "EligibleApplication"');
}

run()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
