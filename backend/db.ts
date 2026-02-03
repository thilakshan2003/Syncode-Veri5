
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/client.js';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

console.log('Database URL found:', !!connectionString);

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Attempting to connect to the database...');
    try {
        const userCount = await prisma.user.count();
        console.log(`✅ Connection successful!`);
        console.log(`Current user count: ${userCount}`);

        // Fetch first user just to be sure
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
            console.log('First user found:', firstUser.username);
        } else {
            console.log('No users found in database yet.');
        }

    } catch (error) {
        console.error('❌ Database connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();