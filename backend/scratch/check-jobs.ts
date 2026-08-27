import { PrismaClient } from '../generated/prisma/client';
import pkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const { Pool } = pkg;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const jobs = await prisma.verificationJob.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        verificationReport: {
          include: {
            verificationIssues: true,
          }
        }
      }
    });

    console.log('Verification Jobs:');
    jobs.forEach(job => {
      console.log(`- Job ID: ${job.id}`);
      console.log(`  Version ID: ${job.applicationVersionId}`);
      console.log(`  Status: ${job.jobStatus}`);
      console.log(`  Created At: ${job.createdAt}`);
      if (job.verificationReport) {
        console.log(`  Report: ${job.verificationReport.overallResult} (score: ${job.verificationReport.confidenceScore})`);
        console.log(`  Issues count: ${job.verificationReport.verificationIssues.length}`);
      } else {
        console.log('  Report: None');
      }
      console.log('');
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
