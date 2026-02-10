import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import crypto from 'crypto';
import {
    PrismaClient,
    UserStatus,
    ClinicStaffRole,
    AppointmentSlotMode,
    AppointmentStatus,
    VerificationStatus,
    PartnerStatus,
    OrderStatus,
    PaymentStatus,
    ShipmentStatus,
    ResourceCategory,
} from '../generated/prisma/client';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const now = () => new Date();
const daysFromNow = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
};
const hoursFrom = (base: Date, hours: number) => new Date(base.getTime() + hours * 60 * 60 * 1000);
const tokenHash = (raw: string) => crypto.createHash('sha256').update(raw).digest('hex');

async function main() {
    console.log('Start seeding ...');

    // --- CLEANUP (reverse dependency order) ---
    await prisma.audit_logs.deleteMany();
    await prisma.shipments.deleteMany();
    await prisma.payments.deleteMany();
    await prisma.order_items.deleteMany();
    await prisma.test_kit_instances.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.appointments.deleteMany();
    await prisma.appointment_slots.deleteMany();
    await prisma.practitioner_clinics.deleteMany();
    await prisma.practitioners.deleteMany();
    await prisma.clinic_staff.deleteMany();
    await prisma.user_verifications.deleteMany();
    await prisma.user_current_status.deleteMany();
    await prisma.partners.deleteMany();
    await prisma.status_shares.deleteMany();
    await prisma.clinics.deleteMany();
    await prisma.test_kits.deleteMany();
    await prisma.users.deleteMany();
    await prisma.resources.deleteMany();

    console.log('Database cleaned.');

    // --- RESOURCES ---
    await prisma.resources.createMany({
        data: [
            {
                category: ResourceCategory.SAFE_SEX,
                title: 'Safer Sex Essentials',
                description: 'Simple habits to reduce STI risk without killing the vibe.',
                content: 'Learn about barrier methods, regular screening, and open communication.',
                imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
                readTime: '5 min read',
            },
            {
                category: ResourceCategory.CONSENT,
                title: 'Consent Made Clear',
                description: 'The F.R.I.E.S. model and how to practice it confidently.',
                content: 'Consent should be Freely given, Reversible, Informed, Enthusiastic, and Specific.',
                imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
                readTime: '4 min read',
            },
            {
                category: ResourceCategory.MENTAL_HEALTH,
                title: 'Managing Academic Stress',
                description: 'Tactics to avoid burnout during exams.',
                content: 'Balance workload, set boundaries, and prioritize rest to stay resilient.',
                imageUrl: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=800&q=80',
                readTime: '6 min read',
            },
            {
                category: ResourceCategory.SEXUAL_WELLBEING,
                title: 'Healthy Intimacy Basics',
                description: 'Build trust and communicate what feels right.',
                content: 'Good communication improves comfort, confidence, and connection.',
                imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80',
                readTime: '5 min read',
            },
        ],
    });

    console.log('Resources created.');

    // --- USERS ---
    const admin = await prisma.users.create({
        data: {
            username: 'admin_user',
            email: 'admin@example.com',
            passwordHash: 'hash_admin',
            status: UserStatus.Verified,
            gender: 'Other',
            ageRange: '25-34',
            preferredPartnerGender: 'Any',
            address: 'Colombo, Sri Lanka',
        },
    });

    const alice = await prisma.users.create({
        data: {
            username: 'alice_w',
            email: 'alice@example.com',
            passwordHash: 'hash_alice',
            status: UserStatus.Verified,
            gender: 'Female',
            ageRange: '25-30',
            preferredPartnerGender: 'Male',
            address: '123 Mushroom Lane',
        },
    });

    const bob = await prisma.users.create({
        data: {
            username: 'bob_m',
            email: 'bob@example.com',
            passwordHash: 'hash_bob',
            status: UserStatus.Not_Verified,
            gender: 'Male',
            ageRange: '18-24',
            preferredPartnerGender: 'Female',
            address: 'Kandy, Sri Lanka',
        },
    });

    const clara = await prisma.users.create({
        data: {
            username: 'clara_s',
            email: 'clara@example.com',
            passwordHash: 'hash_clara',
            status: UserStatus.Verified,
            gender: 'Female',
            ageRange: '35-44',
            preferredPartnerGender: 'Any',
            address: 'Galle, Sri Lanka',
        },
    });

    console.log('Users created.');

    // --- CLINICS ---
    const clinicA = await prisma.clinics.create({
        data: {
            name: 'City Health Center',
            slug: 'city-health-center',
            address: '101 Main St, Colombo',
            lat: '6.9271',
            lng: '79.8612',
            availableTime: 'Mon-Fri 08:00 - 20:00',
        },
    });

    const clinicB = await prisma.clinics.create({
        data: {
            name: 'LifePlus Wellness',
            slug: 'lifeplus-wellness',
            address: '55 Lake Rd, Kandy',
            lat: '7.2906',
            lng: '80.6337',
            availableTime: 'Weekends 09:00 - 15:00',
        },
    });

    const clinicC = await prisma.clinics.create({
        data: {
            name: 'National Hospital Sri Lanka (NHS)',
            slug: 'nhs-colombo',
            address: 'Colombo 10',
            lat: '6.9175',
            lng: '79.8660',
            availableTime: '24/7',
        },
    });

    console.log('Clinics created.');

    // --- CLINIC STAFF ---
    const staffUser1 = await prisma.users.create({
        data: {
            username: 'staff_city_1',
            email: 'staff1@city-health.com',
            passwordHash: 'hash_staff1',
            status: UserStatus.Verified,
        },
    });

    const staffUser2 = await prisma.users.create({
        data: {
            username: 'staff_city_2',
            email: 'staff2@city-health.com',
            passwordHash: 'hash_staff2',
            status: UserStatus.Verified,
        },
    });

    await prisma.clinic_staff.createMany({
        data: [
            { clinicId: clinicA.id, userId: staffUser1.id, role: ClinicStaffRole.clinic_admin },
            { clinicId: clinicA.id, userId: staffUser2.id, role: ClinicStaffRole.staff },
        ],
    });

    console.log('Clinic staff created.');

    // --- PRACTITIONERS ---
    const drSandamaliUser = await prisma.users.create({
        data: {
            username: 'dr_sandamali',
            email: 'sandamali@example.com',
            passwordHash: 'hash_sandamali',
            status: UserStatus.Verified,
        },
    });

    const drChaniduUser = await prisma.users.create({
        data: {
            username: 'dr_chanidu',
            email: 'chanidu@example.com',
            passwordHash: 'hash_chanidu',
            status: UserStatus.Verified,
        },
    });

    const drAjayUser = await prisma.users.create({
        data: {
            username: 'dr_ajay',
            email: 'ajay@example.com',
            passwordHash: 'hash_ajay',
            status: UserStatus.Verified,
        },
    });

    const drSandamali = await prisma.practitioners.create({
        data: {
            userId: drSandamaliUser.id,
            name: 'Dr. Sandamali Jayasinghe',
            specialization: 'Sexual Health Specialist',
            regNo: 'SLMC-1001',
            rating: 4.9,
            experience: 12,
            imageUrl: '',
        },
    });

    const drChanidu = await prisma.practitioners.create({
        data: {
            userId: drChaniduUser.id,
            name: 'Dr. Chanidu Wijepala',
            specialization: 'Venereologist',
            regNo: 'SLMC-1002',
            rating: 4.6,
            experience: 6,
            imageUrl: '',
        },
    });

    const drAjay = await prisma.practitioners.create({
        data: {
            userId: drAjayUser.id,
            name: 'Dr. Ajay Rasiah',
            specialization: 'Venereologist',
            regNo: 'SLMC-1003',
            rating: 4.8,
            experience: 15,
            imageUrl: '',
        },
    });

    await prisma.practitioner_clinics.createMany({
        data: [
            { practitionerId: drSandamali.id, clinicId: clinicA.id },
            { practitionerId: drChanidu.id, clinicId: clinicC.id },
            { practitionerId: drAjay.id, clinicId: clinicA.id },
            { practitionerId: drAjay.id, clinicId: clinicB.id },
        ],
    });

    console.log('Practitioners created.');

    // --- TEST KITS ---
    const standardKit = await prisma.test_kits.create({
        data: {
            name: 'Standard Screen',
            category: 'STD',
            priceCents: 250000,
            description: 'Basic screening for common conditions.',
            active: true,
        },
    });

    const fullKit = await prisma.test_kits.create({
        data: {
            name: 'Full Panel',
            category: 'STD',
            priceCents: 550000,
            description: 'Comprehensive health checkup.',
            active: true,
        },
    });

    console.log('Test kits created.');

    // --- APPOINTMENT SLOTS ---
    const slotBase = daysFromNow(1);
    slotBase.setHours(9, 0, 0, 0);

    const slot1 = await prisma.appointment_slots.create({
        data: {
            practitionerId: drSandamali.id,
            clinicId: clinicA.id,
            mode: AppointmentSlotMode.physical,
            startsAt: slotBase,
            endsAt: hoursFrom(slotBase, 1),
            priceCents: 300000,
            isAvailable: true,
        },
    });

    const slot2 = await prisma.appointment_slots.create({
        data: {
            practitionerId: drSandamali.id,
            mode: AppointmentSlotMode.online,
            startsAt: hoursFrom(slotBase, 3),
            endsAt: hoursFrom(slotBase, 4),
            priceCents: 250000,
            isAvailable: true,
        },
    });

    const slot3 = await prisma.appointment_slots.create({
        data: {
            practitionerId: drChanidu.id,
            clinicId: clinicC.id,
            mode: AppointmentSlotMode.physical,
            startsAt: daysFromNow(2),
            endsAt: hoursFrom(daysFromNow(2), 1),
            priceCents: 0,
            isAvailable: true,
        },
    });

    const slot4 = await prisma.appointment_slots.create({
        data: {
            practitionerId: drAjay.id,
            mode: AppointmentSlotMode.online,
            startsAt: daysFromNow(3),
            endsAt: hoursFrom(daysFromNow(3), 1),
            priceCents: 400000,
            isAvailable: true,
        },
    });

    console.log('Appointment slots created.');

    // --- APPOINTMENTS ---
    const appointment1 = await prisma.appointments.create({
        data: {
            userId: alice.id,
            slotId: slot1.id,
            status: AppointmentStatus.booked,
            createdAt: now(),
        },
    });

    const appointment2 = await prisma.appointments.create({
        data: {
            userId: bob.id,
            slotId: slot3.id,
            status: AppointmentStatus.completed,
            createdAt: daysFromNow(-7),
        },
    });

    console.log('Appointments created.');

    // --- ORDERS + ITEMS ---
    const order1 = await prisma.orders.create({
        data: {
            userId: alice.id,
            deliveryAddress: '123 Mushroom Lane, Colombo',
            status: OrderStatus.paid,
            createdAt: daysFromNow(-5),
        },
    });

    await prisma.order_items.createMany({
        data: [
            { orderId: order1.id, testKitId: standardKit.id, qty: 1, unitPriceCents: standardKit.priceCents },
            { orderId: order1.id, testKitId: fullKit.id, qty: 1, unitPriceCents: fullKit.priceCents },
        ],
    });

    console.log('Orders and items created.');

    // --- PAYMENTS ---
    await prisma.payments.createMany({
        data: [
            {
                orderId: order1.id,
                payhereReference: 'PAY-ORDER-001',
                amountCents: standardKit.priceCents + fullKit.priceCents,
                status: PaymentStatus.paid,
                createdAt: daysFromNow(-5),
            },
            {
                appointmentId: appointment1.id,
                payhereReference: 'PAY-APPT-001',
                amountCents: 300000,
                status: PaymentStatus.initiated,
                createdAt: now(),
            },
        ],
    });

    console.log('Payments created.');

    // --- SHIPMENTS ---
    await prisma.shipments.create({
        data: {
            orderId: order1.id,
            carrier: 'DHL',
            trackingNumber: 'DHL-TRACK-001',
            status: ShipmentStatus.shipped,
            shippedAt: daysFromNow(-3),
        },
    });

    console.log('Shipments created.');

    // --- TEST KIT INSTANCES ---
    await prisma.test_kit_instances.createMany({
        data: [
            {
                serial_number: 'VERI5-TEST-001',
                test_kit_id: standardKit.id,
                order_id: order1.id,
                user_id: alice.id,
                created_at: daysFromNow(-5),
            },
            {
                serial_number: 'VERI5-TEST-002',
                test_kit_id: fullKit.id,
                order_id: order1.id,
                user_id: alice.id,
                used_at: daysFromNow(-2),
                created_at: daysFromNow(-5),
            },
        ],
    });

    console.log('Test kit instances created.');

    // --- USER VERIFICATIONS ---
    const verification1 = await prisma.user_verifications.create({
        data: {
            userId: alice.id,
            testKitId: standardKit.id,
            clinicId: clinicA.id,
            verifiedByUserId: staffUser1.id,
            status: VerificationStatus.verified,
            testedAt: daysFromNow(-4),
            verifiedAt: daysFromNow(-3),
            createdAt: daysFromNow(-4),
        },
    });

    const verification2 = await prisma.user_verifications.create({
        data: {
            userId: bob.id,
            testKitId: fullKit.id,
            clinicId: clinicC.id,
            status: VerificationStatus.processing,
            testedAt: daysFromNow(-1),
            createdAt: daysFromNow(-1),
        },
    });

    console.log('User verifications created.');

    // --- CURRENT STATUS ---
    await prisma.user_current_status.createMany({
        data: [
            { userId: alice.id, status: VerificationStatus.verified, lastVerifiedAt: daysFromNow(-3) },
            { userId: bob.id, status: VerificationStatus.processing, lastVerifiedAt: daysFromNow(-1) },
            { userId: clara.id, status: VerificationStatus.unverified },
        ],
    });

    console.log('User current status created.');

    // --- PARTNERS ---
    await prisma.partners.createMany({
        data: [
            { sharedByUserId: alice.id, receivedByUserId: bob.id, status: PartnerStatus.pending },
            { sharedByUserId: clara.id, receivedByUserId: alice.id, status: PartnerStatus.accepted, acceptedAt: daysFromNow(-10) },
        ],
    });

    console.log('Partners created.');

    // --- STATUS SHARES ---
    const tokenRaw1 = 'share-token-1';
    const tokenRaw2 = 'share-token-2';

    await prisma.status_shares.createMany({
        data: [
            {
                senderUserId: alice.id,
                recipientUserId: bob.id,
                recipientUsernameSnapshot: 'bob_m',
                tokenHash: tokenHash(tokenRaw1),
                createdAt: now(),
                expiresAt: daysFromNow(3),
                maxViews: 3,
                viewCount: 1,
                viewedAt: now(),
            },
            {
                senderUserId: clara.id,
                recipientUsernameSnapshot: 'guest_user',
                tokenHash: tokenHash(tokenRaw2),
                createdAt: now(),
                expiresAt: daysFromNow(1),
                maxViews: 1,
                viewCount: 0,
            },
        ],
    });

    console.log('Status shares created.');

    // --- AUDIT LOGS ---
    await prisma.audit_logs.create({
        data: {
            verificationId: verification1.id,
            userId: staffUser1.id,
            oldStatus: 'processing',
            newStatus: 'verified',
            timestamp: daysFromNow(-3),
        },
    });

    console.log('Audit logs created.');
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