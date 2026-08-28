import { PrismaClient } from '../generated/prisma/client';
import pkg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const { Pool } = pkg;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Connecting to:', connectionString);
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    console.log('Connected successfully!');
    
    const usersCount = await prisma.user.count();
    console.log('Users count:', usersCount);
    
    const users = await prisma.user.findMany({ take: 5 });
    console.log('Sample Users:', JSON.stringify(users, null, 2));

    const appsCount = await prisma.application.count();
    console.log('Applications count:', appsCount);
    
    const apps = await prisma.application.findMany({ take: 5 });
    console.log('Sample Applications:', JSON.stringify(apps, null, 2));

  } catch (error) {
    console.error('Error querying DB:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
