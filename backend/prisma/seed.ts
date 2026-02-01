
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import pkg from '@prisma/client';

dotenv.config();

// @ts-ignore
const { PrismaClient, UserStatus, TestStatus, SessionType, ActivityType } = pkg;

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding ...')

    // --- CLEANUP ---
    await prisma.activity.deleteMany()
    await prisma.partnerShare.deleteMany()
    await prisma.purchase.deleteMany()
    await prisma.appointment.deleteMany()
    await prisma.test.deleteMany()
    await prisma.testKit.deleteMany()
    await prisma.doctor.deleteMany()
    await prisma.clinic.deleteMany()
    await prisma.user.deleteMany()

    console.log('Database cleaned.')

    // --- USERS ---
    const user1 = await prisma.user.create({
        data: {
            email: 'alice@example.com',
            firstName: 'Alice',
            lastName: 'Wonderland',
            password: 'password123', // In a real app, hash this!
            status: UserStatus.VERIFIED,
            gender: 'Female',
            age: 28,
            address: '123 Mushroom Lane',
        },
    })

    const user2 = await prisma.user.create({
        data: {
            email: 'bob@example.com',
            firstName: 'Bob',
            lastName: 'Builder',
            password: 'password123',
            status: UserStatus.UNVERIFIED,
            gender: 'Male',
            age: 35,
            address: '456 Construction Rd',
        },
    })

    const user3 = await prisma.user.create({
        data: {
            email: 'charlie@example.com',
            firstName: 'Charlie',
            lastName: 'Bucket',
            password: 'password123',
            status: UserStatus.UNVERIFIED,
            gender: 'Male',
            age: 12,
            address: '789 Chocolate Factory',
        },
    })

    console.log('Users created.')

    // --- CLINICS ---
    const clinic1 = await prisma.clinic.create({
        data: {
            name: 'City Health Center',
            address: '101 Main St, Colombo',
            availableTime: 'Mon-Fri 08:00 - 20:00',
        },
    })

    const clinic2 = await prisma.clinic.create({
        data: {
            name: 'LifePlus Wellness',
            address: '55 Lake Rd, Kandy',
            availableTime: 'Weekends 09:00 - 15:00',
        },
    })

    console.log('Clinics created.')

    // --- DOCTORS ---
    const doctor1 = await prisma.doctor.create({
        data: {
            name: 'Dr. Sarah Smith',
            specialization: 'Sexual Health Specialist',
            regNo: 'SLMC-1001',
            paymentRate: 3500.00,
            clinics: {
                connect: [{ id: clinic1.id }],
            },
        },
    })

    const doctor2 = await prisma.doctor.create({
        data: {
            name: 'Dr. John Doe',
            specialization: 'General Practitioner',
            regNo: 'SLMC-1002',
            paymentRate: 2500.00,
            clinics: {
                connect: [{ id: clinic1.id }, { id: clinic2.id }],
            },
        },
    })

    console.log('Doctors created.')

    // --- TEST KITS ---
    const kit1 = await prisma.testKit.create({
        data: {
            name: 'Standard Screen',
            price: 2500.00,
            description: 'Basic screening for common conditions.',
        },
    })

    const kit2 = await prisma.testKit.create({
        data: {
            name: 'Full Panel',
            price: 5500.00,
            description: 'Comprehensive health checkup.',
        },
    })

    console.log('Test Kits created.')

    // --- DATA FOR USER 1 (Alice) ---

    // 1. Tests
    await prisma.test.create({
        data: {
            testId: 'v5-9999-al01',
            userId: user1.id,
            date: new Date('2023-10-15'),
            type: 'Standard Screen',
            category: 'Basic',
            status: TestStatus.VALIDATED,
            testResults: 'https://example.com/result-alice-1.pdf',
        },
    })

    // 2. Purchases
    await prisma.purchase.create({
        data: {
            userId: user1.id,
            testKitId: kit1.id,
            deliveryAddress: user1.address || 'Default Address',
        },
    })

    // 3. Appointments
    await prisma.appointment.create({
        data: {
            userId: user1.id,
            doctorId: doctor1.id,
            clinicId: clinic1.id,
            date: new Date('2023-11-20T10:00:00Z'),
            time: '10:00 AM',
            sessionType: SessionType.PHYSICAL,
            cost: doctor1.paymentRate,
        },
    })

    // 4. Partner Share (Alice shares with Bob)
    await prisma.partnerShare.create({
        data: {
            senderId: user1.id,
            receiverId: user2.id,
            expiryDate: new Date('2024-01-01'),
        }
    })

    // 5. Activity Log
    await prisma.activity.create({
        data: {
            userId: user1.id,
            type: ActivityType.SHARE,
            description: 'Shared health status with Bob',
        }
    })

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
