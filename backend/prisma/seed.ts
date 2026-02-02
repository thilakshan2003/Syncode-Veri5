
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { PrismaClient, UserStatus, AppointmentSlotMode, AppointmentStatus, OrderStatus, PaymentStatus, ShipmentStatus } from '../generated/prisma/client';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding ...');

    // --- CLEANUP ---
    // Delete in reverse order of dependencies to avoid foreign key constraints
    await prisma.shipment.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.appointmentSlot.deleteMany();
    await prisma.practitionerClinic.deleteMany();
    await prisma.practitioner.deleteMany();
    await prisma.clinicStaff.deleteMany();
    await prisma.userVerification.deleteMany();
    await prisma.userCurrentStatus.deleteMany();
    await prisma.partner.deleteMany();
    await prisma.statusShare.deleteMany();
    // await prisma.userProfile.deleteMany(); // Removed as model is deleted
    await prisma.clinic.deleteMany();
    await prisma.testKit.deleteMany();
    await prisma.testType.deleteMany();
    await prisma.user.deleteMany();

    console.log('Database cleaned.');

    // --- TEST TYPES ---
    const hivTest = await prisma.testType.create({
        data: {
            name: 'HIV 1/2 Ab/Ag',
            category: 'STD',
            active: true
        }
    });

    const syphilisTest = await prisma.testType.create({
        data: {
            name: 'Syphilis Antibody',
            category: 'STD',
            active: true
        }
    });

    console.log('Test Types created.');

    // --- TEST KITS ---
    const standardKit = await prisma.testKit.create({
        data: {
            name: 'Standard Screen',
            priceCents: 250000, // 2500.00
            description: 'Basic screening for common conditions.',
            active: true,
        },
    });

    const fullKit = await prisma.testKit.create({
        data: {
            name: 'Full Panel',
            priceCents: 550000, // 5500.00
            description: 'Comprehensive health checkup.',
            active: true,
        },
    });

    console.log('Test Kits created.');

    // --- CLINICS ---
    const clinic1 = await prisma.clinic.create({
        data: {
            name: 'City Health Center',
            address: '101 Main St, Colombo',
            availableTime: 'Mon-Fri 08:00 - 20:00',
        },
    });

    const clinic2 = await prisma.clinic.create({
        data: {
            name: 'LifePlus Wellness',
            address: '55 Lake Rd, Kandy',
            availableTime: 'Weekends 09:00 - 15:00',
        },
    });

    console.log('Clinics created.');

    // --- USERS: PATIENT ALICE ---
    const alice = await prisma.user.create({
        data: {
            username: 'alice_w',
            email: 'alice@example.com',
            passwordHash: 'hashed_password_placeholder',
            status: UserStatus.Verified,
            gender: 'Female',
            ageRange: '25-30',
            address: '123 Mushroom Lane',
        },
    });

    // --- USERS: PATIENT BOB ---
    const bob = await prisma.user.create({
        data: {
            username: 'bob_b',
            email: 'bob@example.com',
            passwordHash: 'hashed_password_placeholder',
            status: UserStatus.Verified,
            gender: 'Male',
            ageRange: '30-35',
            address: '456 Construction Rd',
            currentStatus: {
                create: {
                    status: 'unverified'
                }
            }
        },
    });

    // --- USERS: DOCTOR SARAH ---
    const drSarahUser = await prisma.user.create({
        data: {
            username: 'dr_sarah',
            email: 'sarah@example.com',
            passwordHash: 'hashed_password_placeholder',
            status: UserStatus.Verified,
        },
    });

    const drSarahPractitioner = await prisma.practitioner.create({
        data: {
            userId: drSarahUser.id,
            name: 'Dr. Sarah Smith',
            specialization: 'Sexual Health Specialist',
            regNo: 'SLMC-1001',
            clinics: {
                create: [
                    { clinicId: clinic1.id }
                ]
            }
        },
    });

    // --- USERS: DOCTOR JOHN ---
    const drJohnUser = await prisma.user.create({
        data: {
            username: 'dr_john',
            email: 'john@example.com',
            passwordHash: 'hashed_password_placeholder',
            status: UserStatus.Verified,
        },
    });

    const drJohnPractitioner = await prisma.practitioner.create({
        data: {
            userId: drJohnUser.id,
            name: 'Dr. John Doe',
            specialization: 'General Practitioner',
            regNo: 'SLMC-1002',
            clinics: {
                create: [
                    { clinicId: clinic1.id },
                    { clinicId: clinic2.id }
                ]
            }
        },
    });

    console.log('Users and Practitioners created.');

    // --- APPOINTMENT SLOTS ---
    // Create a slot for Dr. Sarah tomorrow at 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const endsAt = new Date(tomorrow);
    endsAt.setHours(11, 0, 0, 0);

    const slot1 = await prisma.appointmentSlot.create({
        data: {
            practitionerId: drSarahPractitioner.id,
            clinicId: clinic1.id,
            mode: AppointmentSlotMode.physical,
            startsAt: tomorrow,
            endsAt: endsAt,
            priceCents: 350000,
            isAvailable: false, // Will be booked
        }
    });

    // Create available slot for next day
    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextEnds = new Date(nextDay);
    nextEnds.setHours(11, 0, 0, 0);

    await prisma.appointmentSlot.create({
        data: {
            practitionerId: drSarahPractitioner.id,
            clinicId: clinic1.id,
            mode: AppointmentSlotMode.online,
            startsAt: nextDay,
            endsAt: nextEnds,
            priceCents: 300000,
            isAvailable: true,
        }
    });

    console.log('Appointment Slots created.');

    // --- APPOINTMENT ---
    const appointment1 = await prisma.appointment.create({
        data: {
            userId: alice.id,
            slotId: slot1.id,
            status: AppointmentStatus.booked,
        }
    });

    // --- ORDER ---
    const order1 = await prisma.order.create({
        data: {
            userId: alice.id,
            deliveryAddress: '123 Mushroom Lane',
            status: OrderStatus.paid,
            items: {
                create: [
                    {
                        testKitId: standardKit.id,
                        qty: 1,
                        unitPriceCents: standardKit.priceCents
                    }
                ]
            }
        }
    });

    // --- PAYMENT for Order ---
    await prisma.payment.create({
        data: {
            orderId: order1.id,
            payhereReference: 'PAY-123456',
            amountCents: 250000,
            status: PaymentStatus.paid
        }
    });

    console.log('Appointments and Orders created.');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
