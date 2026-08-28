import { Queue } from 'bullmq';
import 'dotenv/config';

async function main() {
  const queue = new Queue('verification', {
    connection: {
      host: process.env.REDIS_HOST ?? '127.0.0.1',
      port: Number(process.env.REDIS_PORT ?? 6379),
    }
  });

  try {
    const failedJobs = await queue.getJobs(['failed']);
    const waitingJobs = await queue.getJobs(['waiting']);
    const activeJobs = await queue.getJobs(['active']);
    console.log(`Failed jobs count: ${failedJobs.length}`);
    console.log(`Waiting jobs count: ${waitingJobs.length}`);
    console.log(`Active jobs count: ${activeJobs.length}`);
    if (waitingJobs.length > 0) {
      console.log(`First waiting job ID: ${waitingJobs[0].id}`);
    }
    if (activeJobs.length > 0) {
      console.log(`First active job ID: ${activeJobs[0].id}`);
    }

    // Check Redis connection ping
    console.log(`Redis connected.`);

  } catch (err) {
    console.error(err);
  } finally {
    await queue.close();
  }
}

main();
