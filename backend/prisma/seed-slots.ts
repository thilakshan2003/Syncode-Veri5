import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { PrismaClient, AppointmentSlotMode } from '../generated/prisma/client';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const ensureSlot = async (data: {
    practitionerId: bigint;
    clinicId?: bigint | null;
    mode: AppointmentSlotMode;
    startsAt: Date;
    endsAt: Date;
    priceCents: number;
    isAvailable: boolean;
}) => {
    const exists = await prisma.appointment_slots.findFirst({
        where: {
            practitionerId: data.practitionerId,
            clinicId: data.clinicId ?? null,
            mode: data.mode,
            startsAt: data.startsAt,
            endsAt: data.endsAt,
        },
        select: { id: true },
    });

    if (!exists) {
        await prisma.appointment_slots.create({ data });
    }
};

async function main() {
    console.log('🗓️  Seeding appointment slots only...');

    const drSandamali = await prisma.practitioners.findFirst({
        where: { name: 'Dr. Sandamali Jayasinghe' },
        select: { id: true },
    });
    const drChanidu = await prisma.practitioners.findFirst({
        where: { name: 'Dr. Chanidu Wijepala' },
        select: { id: true },
    });
    const drAjay = await prisma.practitioners.findFirst({
        where: { name: 'Dr. Ajay Rasiah' },
        select: { id: true },
    });

    if (!drSandamali || !drChanidu || !drAjay) {
        throw new Error('Missing practitioners. Run the full seed once before seeding slots.');
    }

    const clinic1 = await prisma.clinics.findFirst({
        orderBy: { id: 'asc' },
        select: { id: true },
    });

    const nhsClinic = await prisma.clinics.findFirst({
        where: { slug: 'nhs-colombo' },
        select: { id: true },
    });

    if (!clinic1 || !nhsClinic) {
        throw new Error('Missing clinics. Run the full seed once before seeding slots.');
    }

    const today = new Date();

    const totalDays = 90;
    for (let i = 0; i < totalDays; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dayOfWeek = d.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const slotHours = [9, 11, 13, 15, 17];

        for (const hour of slotHours) {
            const start = new Date(d); start.setHours(hour, 0, 0, 0);
            const end = new Date(d); end.setHours(hour + 1, 0, 0, 0);

            // Dr. Sandamali: Weekdays Online, Weekends Physical
            if (!isWeekend) {
                await ensureSlot({
                    practitionerId: drSandamali.id,
                    mode: AppointmentSlotMode.online,
                    startsAt: start,
                    endsAt: end,
                    priceCents: 250000,
                    isAvailable: true,
                });
            } else {
                await ensureSlot({
                    practitionerId: drSandamali.id,
                    clinicId: clinic1.id,
                    mode: AppointmentSlotMode.physical,
                    startsAt: start,
                    endsAt: end,
                    priceCents: 300000,
                    isAvailable: true,
                });
            }

            // Dr. Chanidu: Weekends Online, Free at NHS (Anytime/Mixed)
            if (isWeekend) {
                await ensureSlot({
                    practitionerId: drChanidu.id,
                    mode: AppointmentSlotMode.online,
                    startsAt: start,
                    endsAt: end,
                    priceCents: 200000,
                    isAvailable: true,
                });
            }

            // Add some free NHS slots on random days (including weekdays)
            if (i % 2 === 0) {
                await ensureSlot({
                    practitionerId: drChanidu.id,
                    clinicId: nhsClinic.id,
                    mode: AppointmentSlotMode.physical,
                    startsAt: start,
                    endsAt: end,
                    priceCents: 0,
                    isAvailable: true,
                });
            }

            // Dr. Ajay: Daily Online
            await ensureSlot({
                practitionerId: drAjay.id,
                mode: AppointmentSlotMode.online,
                startsAt: start,
                endsAt: end,
                priceCents: 400000,
                isAvailable: true,
            });
        }
    }

    console.log('✅ Appointment slots seeding completed.');
    console.log(`📅 Date range: ${toDateKey(today)} to ${toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + (totalDays - 1)))}`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
