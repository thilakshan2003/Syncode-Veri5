
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
    PrismaClient,
    UserStatus,
    AppointmentSlotMode,
    AppointmentStatus,
    OrderStatus,
    PaymentStatus,
    ShipmentStatus,
    ResourceCategory,
    VerificationStatus,
    ClinicStaffRole
} from '../generated/prisma/client';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🚀 Start seeding comprehensive data ...');

    // --- CLEANUP (Order matters for foreign keys) ---
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

    console.log('🧹 Database cleaned.');

    const STAFF_PASSWORD = await bcrypt.hash('Veri5Staff2026!', 10);
    const USER_PASSWORD = await bcrypt.hash('Veri5User2026!', 10);

    // --- RESOURCES (36 Articles, ~200 words each) ---
    const resourceBase = [
        {
            category: ResourceCategory.SAFE_SEX,
            titles: [
                "Navigating Modern Contraception: A Student's Guide",
                "STIs 101: Knowledge is Power and Prevention",
                "The Art of the 'Condom Conversation' in Dating",
                "Emergency Contraception: Myths vs. Vital Facts",
                "Beyond the Binary: Queer-Inclusive Safe Sex Practices",
                "The Science of Lubrication: Why It Matters for Safety",
                "Digital Health: Tracking Your Fertility and Cycle",
                "PrEP and PEP: The New Era of Medical HIV Prevention",
                "Mindful Choices: Alcohol and Sexual Decision Making"
            ]
        },
        {
            category: ResourceCategory.CONSENT,
            titles: [
                "Understanding the F.R.I.E.S. Model for True Consent",
                "The Power of 'No': Redefining Boundaries and Trust",
                "Continuous Communication: On-going Consent Check-ins",
                "Capacity and Clarity: The Impact of Alcohol on Consent",
                "Digital Respect: Navigating Boundaries in an Online World",
                "Be the Change: Bystander Intervention Training on Campus",
                "Distance But No Divide: Boundaries in LDRs",
                "Recognizing Complexity: Consent and Social Power Dynamics",
                "The Ethical Importance of Emotional Aftercare"
            ]
        },
        {
            category: ResourceCategory.MENTAL_HEALTH,
            titles: [
                "Burnout Recovery: When 'Busy' Becomes Unsustainable",
                "Social Media and the 'Comparison Trap' in University",
                "The Biological Necessity of Sleep for Mental Resilience",
                "You Belong Here: Strategies to Overcome Imposter Syndrome",
                "Quiet the Storm: Grounding Techniques for Peak Anxiety",
                "Healing in Private: Navigating Loss While Life Keeps Moving",
                "Joy for Joy's Sake: The Therapeutic Power of Hobbies",
                "Adulting 101: Setting Healthy Boundaries with Family",
                "Winter Wellness: Managing Seasonal Affective Disorder"
            ]
        },
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            titles: [
                "The Journey Inward: A Guide to Self-Pleasure Discovery",
                "Radical Acceptance: Body Positivity in Intimate Spaces",
                "Holistic Health: The Emotional Side of Sexual Anatomy",
                "Finding Your Voice: Communicating Complex Desires",
                "The Wellness Pillar: Sexual Health as Core Fitness",
                "Intentional Connections: Integrity in Modern Hookup Culture",
                "Cycle Synergy: Understanding Menstrual Health and Desire",
                "Breathe Through It: Overcoming New Experience Jitters",
                "The Biological Symphony: Understanding the Physiology of Orgasm"
            ]
        }
    ];

    const generateContent = (title: string, cat: ResourceCategory) => {
        return `Exploring the intricacies of ${title} is fundamental to a well-rounded understanding of ${cat.toLowerCase().replace('_', ' ')} in the modern age. As we navigate the complexities of adult relationships and personal health, it becomes increasingly clear that information is our most powerful tool for autonomy and well-being. This comprehensive guide is designed to provide you with the evidence-based insights and practical frameworks necessary to make informed decisions that align with your values and lifestyle.

Wellness is rarely a linear path; rather, it is a continuous commitment to self-education and open communication. Whether you are addressing ${title} specifically or looking at it through a broader lens, the key remains a balance between physiological awareness and psychological resilience. The intersection of technology and healthcare has introduced innovative tools—from cycle trackers to discreet testing platforms—that dismantle historical barriers to care. However, these tools are most effective when paired with a strong internal sense of boundary-setting and radical self-respect.

As you integrate these practices into your daily life, reflect on how your environment and community impact your perspective. Seeking information and support is not a sign of deficit but an ultimate act of strength and self-care. By prioritizing your holistic health, you contribute to a growing culture of dignity and respect that benefits society as a whole. Let this knowledge empower you to lead a life of confidence, safety, and deep fulfillment. Your journey toward excellence starts with the courage to understand your own body and mind.`;
    };

    const finalResources = [];
    for (const group of resourceBase) {
        for (const title of group.titles) {
            finalResources.push({
                category: group.category,
                title: title,
                description: `An in-depth exploration of ${title.toLowerCase()} for student wellness.`,
                content: generateContent(title, group.category),
                imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000000)}?auto=format&fit=crop&w=800&q=80`,
                readTime: `${Math.floor(Math.random() * 5) + 4} min read`
            });
        }
    }
    await prisma.resources.createMany({ data: finalResources });
    console.log('📚 36 Polished Resources added.');

    // --- TEST KITS ---
    const kitData = [
        { name: 'HIV-1/2 Rapid Kit', category: 'STD', priceCents: 250000, description: 'Rapid, discreet HIV-1/2 antibody screening.', active: true },
        { name: 'Syphilis RPR Kit', category: 'STD', priceCents: 180000, description: 'Standard RPR screen for Syphilis detection.', active: true },
        { name: 'Full Panel Screen', category: 'Comprehensive', priceCents: 850000, description: '7-in-1 complete wellness and STD panel.', active: true },
    ];
    const kitRecords = [];
    for (const k of kitData) {
        kitRecords.push(await prisma.test_kits.create({ data: k }));
    }
    console.log('📦 Core Test Kits created.');

    // --- CLINICS & STAFF (5 Clinics, 2 Staff Each) ---
    const clinicNames = ['Lanka Hospitals - Veri5 Wing', 'Asiri Central Lab', 'Nawaloka Health Hub', 'Durdan’s Diagnostic Wing', 'Hemas Wellness Center'];
    const slugs = ['lanka-hospitals', 'asiri-central', 'nawaloka-hub', 'durdans-diagnostic', 'hemas-wellness'];
    const clinics = [];
    for (let i = 0; i < 5; i++) {
        const clinic = await prisma.clinics.create({
            data: {
                name: clinicNames[i],
                slug: slugs[i],
                address: `${i + 150} Diagnostic Boulevard, Colombo`,
                lat: 6.9271 + (i * 0.005),
                lng: 79.8612 + (i * 0.005),
                availableTime: 'Mon-Sun 08:00 - 20:00'
            }
        });
        clinics.push(clinic);

        for (let j = 1; j <= 2; j++) {
            const staffUser = await prisma.users.create({
                data: {
                    username: `staff_${slugs[i]}_${j}`,
                    email: `staff${j}@${slugs[i]}.com`,
                    passwordHash: STAFF_PASSWORD,
                    status: UserStatus.Verified
                }
            });
            await prisma.clinic_staff.create({
                data: {
                    userId: staffUser.id,
                    clinicId: clinic.id,
                    role: j === 1 ? ClinicStaffRole.clinic_admin : ClinicStaffRole.staff
                }
            });
        }
    }
    console.log('🏥 5 Clinical Locations & 10 Staff Members established.');

    // Special NHS Clinic
    const nhsClinic = await prisma.clinics.create({
        data: { name: 'National Hospital Sri Lanka (NHS)', slug: 'nhs-colombo', address: 'Colombo 10', availableTime: '24/7' }
    });

    // --- PATIENTS (50 Unique Users) ---
    const users = [];
    for (let i = 1; i <= 50; i++) {
        users.push(await prisma.users.create({
            data: {
                username: `user_${i}`,
                email: `patient${i}@example.com`,
                passwordHash: USER_PASSWORD,
                gender: i % 2 === 0 ? 'Male' : 'Female',
                ageRange: i < 20 ? '18-24' : (i < 40 ? '25-34' : '35-44'),
                address: 'Colombo, Sri Lanka',
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))
            }
        }));
    }
    console.log('👥 50 Unique Patient Profiles generated.');

    // --- ACTIVITY (Orders, Kits, Appointments) ---
    // 20 Kit Orders
    for (let i = 0; i < 20; i++) {
        const user = users[i];
        const kit = kitRecords[i % kitRecords.length];
        const createdAt = new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000));

        const order = await prisma.orders.create({
            data: {
                userId: user.id,
                deliveryAddress: 'Home Delivery, Colombo',
                status: OrderStatus.paid,
                createdAt: createdAt,
                items: { create: [{ testKitId: kit.id, qty: 1, unitPriceCents: kit.priceCents }] }
            }
        });

        await prisma.test_kit_instances.create({
            data: {
                serial_number: `VERI5-${order.id}-${Math.floor(Math.random() * 9999)}`,
                test_kit_id: kit.id,
                order_id: order.id,
                user_id: user.id
            }
        });
    }

    // 20 Appointments
    const practitionerNames = ["Dr. Sandamali Jayasinghe", "Dr. Chanidu Wijepala", "Dr. Ajay Rasiah"];
    const practitioners = [];
    for (let i = 0; i < practitionerNames.length; i++) {
        const u = await prisma.users.create({
            data: {
                username: `doc_${i}`,
                email: `dr${i}@veri5-internal.com`,
                passwordHash: STAFF_PASSWORD,
                status: UserStatus.Verified
            }
        });
        const dr = await prisma.practitioners.create({
            data: {
                userId: u.id,
                name: practitionerNames[i],
                specialization: i === 0 ? "Sexual Health Specialist" : "Venereologist",
                experience: 8 + i,
                rating: 4.5 + (i * 0.1),
                clinics: { create: [{ clinicId: clinics[i % clinics.length].id }] }
            }
        });
        practitioners.push(dr);
    }

    // --- GENERATE SLOTS (Next 14 days) ---
    const [drSandamali, drChanidu, drAjay] = practitioners;
    const clinic1 = clinics[0];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dayOfWeek = d.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const start = new Date(d); start.setHours(9, 0, 0, 0);
        const end = new Date(d); end.setHours(17, 0, 0, 0);

        // Dr. Sandamali: Weekdays Online, Weekends Physical
        if (!isWeekend) {
            await prisma.appointment_slots.create({
                data: { practitionerId: drSandamali.id, mode: AppointmentSlotMode.online, startsAt: start, endsAt: end, priceCents: 250000, isAvailable: true }
            });
        } else {
            await prisma.appointment_slots.create({
                data: { practitionerId: drSandamali.id, clinicId: clinic1.id, mode: AppointmentSlotMode.physical, startsAt: start, endsAt: end, priceCents: 300000, isAvailable: true }
            });
        }

        // Dr. Chanidu: Weekends Online, Free at NHS (Anytime/Mixed)
        if (isWeekend) {
            await prisma.appointment_slots.create({
                data: { practitionerId: drChanidu.id, mode: AppointmentSlotMode.online, startsAt: start, endsAt: end, priceCents: 200000, isAvailable: true }
            });
        }

        // Add some free NHS slots on random days (including weekdays)
        if (i % 2 === 0) {
            await prisma.appointment_slots.create({
                data: { practitionerId: drChanidu.id, clinicId: nhsClinic.id, mode: AppointmentSlotMode.physical, startsAt: start, endsAt: end, priceCents: 0, isAvailable: true }
            });
        }

        // Dr. Ajay: Daily Online
        await prisma.appointment_slots.create({
            data: { practitionerId: drAjay.id, mode: AppointmentSlotMode.online, startsAt: start, endsAt: end, priceCents: 400000, isAvailable: true }
        });
    }

    console.log('Detailed slots created.');

    for (let i = 20; i < 40; i++) {
        const user = users[i];
        const dr = practitioners[i % practitioners.length];
        const clinic = clinics[i % clinics.length];
        const start = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));

        const slot = await prisma.appointment_slots.create({
            data: {
                practitionerId: dr.id,
                clinicId: clinic.id,
                mode: AppointmentSlotMode.physical,
                startsAt: start,
                endsAt: new Date(start.getTime() + 3600000),
                priceCents: 450000,
                isAvailable: false
            }
        });
        await prisma.appointments.create({
            data: { userId: user.id, slotId: slot.id, status: AppointmentStatus.completed, createdAt: start }
        });
    }

    // 30 Lab Submissions
    const subStatuses = [VerificationStatus.processing, VerificationStatus.verified, VerificationStatus.processing, VerificationStatus.unverified];
    for (let i = 0; i < 30; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const clinic = clinics[Math.floor(Math.random() * clinics.length)];
        const stat = subStatuses[i % subStatuses.length];
        const createdAt = new Date(Date.now() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000));

        const v = await prisma.user_verifications.create({
            data: {
                userId: user.id,
                testKitId: kitRecords[0].id,
                clinicId: clinic.id,
                status: stat,
                createdAt: createdAt,
                testedAt: createdAt,
                verifiedAt: stat === VerificationStatus.verified ? new Date(createdAt.getTime() + (Math.random() * 48 * 3600000)) : null
            }
        });

        if (stat === VerificationStatus.verified) {
            const staff = await prisma.clinic_staff.findFirst({ where: { clinicId: clinic.id } });
            if (staff) {
                await prisma.audit_logs.create({
                    data: {
                        verificationId: v.id,
                        userId: staff.userId,
                        oldStatus: 'processing',
                        newStatus: 'verified',
                        timestamp: v.verifiedAt || new Date()
                    }
                });
            }
        }
    }

    // Alice Data (Retained)
    await prisma.users.create({
        data: {
            username: 'alice_w',
            email: 'alice@example.com',
            passwordHash: USER_PASSWORD,
            status: UserStatus.Verified,
            gender: 'Female',
            ageRange: '25-30',
            address: '123 Mushroom Lane',
        },
    });

    console.log('✅ Seeding Complete.');
    console.log('🔑 Staff Login: email like staff1@asiri-central.com | PWD: Veri5Staff2026!');
    console.log('🔑 Patient Login: email like patient1@example.com | PWD: Veri5User2026!');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });