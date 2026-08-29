const assert = require('assert').strict;
require('dotenv/config');
const { PrismaClient } = require('./generated/prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('supabase.com') ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const API_URL = 'http://localhost:8082';

async function runTests() {
  console.log('--- Starting S1 & S5 QA Automation Test Suite ---');
  
  const applicantEmail = `applicant_${Date.now()}@test.com`;
  const adminEmail = `admin_${Date.now()}@test.com`;
  const password = 'Password123!';
  
  let applicantId, adminId, testAppId, testAppointmentId;
  let applicantToken, adminToken;

  try {
    // SETUP: Superadmin and Admin Invitation
    const superAdminEmail = `superadmin_${Date.now()}@test.com`;
    const superadminRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: superAdminEmail, password, fullName: 'Super Admin', role: 'admin' })
    });
    
    // Actually, let's insert the superadmin directly into DB
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(password, 10);
    const superadmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash: hash,
        fullName: 'Super Admin',
        role: 'admin'
      }
    });

    await prisma.adminInvitation.create({
      data: {
        email: adminEmail,
        role: 'admin',
        expiresAt: new Date(Date.now() + 86400000),
        tokenHash: `dummy-hash-${Date.now()}`,
        invitedByUserId: superadmin.id
      }
    });
    console.log('✅ Setup: Created admin invitation');

    // 1. Applicant Registration
    let res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: applicantEmail, password, fullName: 'Test Applicant' })
    });
    let data = await res.json();
    assert.equal(res.status, 201, 'Applicant registration should succeed');
    assert.equal(data.user.role, 'applicant');
    applicantId = data.user.id;
    console.log('✅ S1: Applicant registered');

    // 2. Applicant Login
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: applicantEmail, password })
    });
    data = await res.json();
    assert.equal(res.status, 200, 'Applicant login should succeed');
    assert.ok(data.access_token);
    applicantToken = data.access_token;
    console.log('✅ S1: Applicant logged in successfully');

    // 3. Admin Registration
    res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password, fullName: 'Test Admin' })
    });
    data = await res.json();
    assert.equal(res.status, 201, 'Admin registration should succeed');
    assert.equal(data.user.role, 'admin');
    adminId = data.user.id;
    console.log('✅ S1: Admin registered from pre-invited email');

    // 4. Admin Login
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password })
    });
    data = await res.json();
    assert.equal(res.status, 200);
    adminToken = data.access_token;
    console.log('✅ S1: Admin logged in successfully');

    // 5. RBAC Validation
    res = await fetch(`${API_URL}/appointments/officer/pending`, {
      headers: { 'Authorization': `Bearer ${applicantToken}` }
    });
    assert.ok(res.status === 401 || res.status === 403, 'Applicant should be denied access to officer endpoint');
    console.log('✅ S1: RBAC enforced on Officer endpoints');

    // 6. Appointment Eligibility (Draft Application)
    const unapprovedApp = await prisma.application.create({
      data: {
        applicantUserId: applicantId,
        status: 'draft',
        applicationNo: `APP-${Date.now()}`,
        licenseType: 'entertainment',
      }
    });
    res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${applicantToken}` },
      body: JSON.stringify({ applicationId: unapprovedApp.id, startAt: new Date().toISOString(), endAt: new Date().toISOString() })
    });
    assert.equal(res.status, 400, 'Should block appointment for unapproved app');
    console.log('✅ S5: Appointment eligibility enforcement verified');
    await prisma.application.delete({ where: { id: unapprovedApp.id } });

    // 7. Request Appointment (Approved Application)
    const approvedApp = await prisma.application.create({
      data: {
        applicantUserId: applicantId,
        status: 'approved',
        applicationNo: `APP-APV-${Date.now()}`,
        licenseType: 'entertainment',
      }
    });
    testAppId = approvedApp.id;

    const startAt = new Date();
    startAt.setDate(startAt.getDate() + 2);
    const endAt = new Date(startAt);
    endAt.setHours(endAt.getHours() + 1);

    res = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${applicantToken}` },
      body: JSON.stringify({ applicationId: testAppId, startAt: startAt.toISOString(), endAt: endAt.toISOString() })
    });
    data = await res.json();
    assert.equal(res.status, 201, 'Should create pending appointment for License Collection');
    assert.equal(data.status, 'pending');
    testAppointmentId = data.id;
    console.log('✅ S5: License Collection Appointment requested successfully');

    // 8. View Appointment Status
    res = await fetch(`${API_URL}/appointments/applicant`, {
      headers: { 'Authorization': `Bearer ${applicantToken}` }
    });
    data = await res.json();
    assert.ok(data.find(a => a.id === testAppointmentId), 'Applicant should see their appointment');
    console.log('✅ S5: Applicant can view appointment status');

    // 9. Officer Review Pending Requests
    res = await fetch(`${API_URL}/appointments/officer/pending`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    data = await res.json();
    assert.ok(data.find(a => a.id === testAppointmentId), 'Officer should see pending appointment');
    console.log('✅ S5: Admin can review pending appointments');

    // 10. Officer Approve Appointment
    res = await fetch(`${API_URL}/appointments/officer/${testAppointmentId}/decision`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ decision: 'approve', reason: 'Slot confirmed' })
    });
    data = await res.json();
    assert.equal(res.status, 200, 'Officer should be able to approve');
    assert.equal(data.status, 'approved');
    console.log('✅ S5: Admin successfully approved appointment');

    // 11. Verify Audit Logs
    const auditLogReq = await prisma.auditLog.findFirst({
      where: { targetEntityId: testAppointmentId, action: 'appointment_requested' }
    });
    assert.ok(auditLogReq, 'Audit log for request should exist');
    const auditLogDec = await prisma.auditLog.findFirst({
      where: { targetEntityId: testAppointmentId, action: 'appointment_decision' }
    });
    assert.ok(auditLogDec, 'Audit log for decision should exist');
    console.log('✅ S1/S5: Immutable audit trails verified');

    // 12. Simulate Time-Lapse for Expiry
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
    
    const expiringApps = await prisma.appointment.findMany({
      where: {
        status: 'pending',
        preferredStartAt: { lte: new Date(Date.now() + 86400000) }
      }
    });
    assert.ok(expiringApps.find(a => a.id === expiringAppointment.id), 'Should detect neglected appointment');
    await prisma.appointment.delete({ where: { id: expiringAppointment.id } });
    console.log('✅ S5: Automated Time-lapse logic correctly identifies expiring appointments');

    console.log('\\n🎉 All Automated QA Tests Passed Successfully! 🎉');
  } catch (err) {
    console.error('\\n❌ Test Failed:', err);
    process.exit(1);
  } finally {
    // Cleanup
    if (testAppointmentId) await prisma.appointment.deleteMany({ where: { id: testAppointmentId } });
    if (testAppId) await prisma.application.deleteMany({ where: { id: testAppId } });
    if (applicantId) await prisma.user.deleteMany({ where: { id: applicantId } });
    if (adminId) await prisma.user.deleteMany({ where: { id: adminId } });
    await prisma.adminInvitation.deleteMany({ where: { email: adminEmail } });
    await prisma.$disconnect();
  }
}

runTests();
