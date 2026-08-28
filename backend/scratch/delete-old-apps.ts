import { PrismaClient } from '../generated/prisma/client';
import pkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const applicationNos = ['APP-1787159210784', 'APP-1787158212688'];

  for (const appNo of applicationNos) {
    const app = await prisma.application.findUnique({
      where: { applicationNo: appNo },
      include: { versions: true }
    });

    if (app) {
      const versionIds = app.versions.map(v => v.id);

      // 1. Delete VerificationJobs
      await prisma.verificationJob.deleteMany({
        where: { applicationVersionId: { in: versionIds } }
      });

      // 2. Delete ApplicationDocuments
      await prisma.applicationDocument.deleteMany({
        where: { applicationVersionId: { in: versionIds } }
      });

      // 3. Clear current version ID to prevent circular dependencies
      await prisma.application.update({
        where: { id: app.id },
        data: { currentApplicationVersionId: null }
      });

      // 4. Delete ApplicationVersions
      await prisma.applicationVersion.deleteMany({
        where: { applicationId: app.id }
      });

      // 5. Delete Application
      await prisma.application.delete({
        where: { id: app.id }
      });

      console.log(`Successfully deleted ${appNo}`);
    } else {
      console.log(`Application ${appNo} not found in database.`);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
