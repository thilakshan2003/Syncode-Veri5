
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { PrismaClient, UserStatus, AppointmentSlotMode, AppointmentStatus, OrderStatus, PaymentStatus, ShipmentStatus, ResourceCategory } from '../generated/prisma/client';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding ...');

    // --- CLEANUP ---
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
    await prisma.clinic.deleteMany();
    await prisma.testKit.deleteMany();
    await prisma.testType.deleteMany();
    await prisma.user.deleteMany();
    await prisma.resource.deleteMany();

    console.log('Database cleaned.');

    // --- RESOURCES (36 Articles) ---
    const resourceData = [
        // SAFE_SEX (9)
        {
            category: ResourceCategory.SAFE_SEX,
            title: "Navigating Modern Contraception: A Student's Guide",
            description: "Everything you need to know about picking the right protection for your lifestyle.",
            content: "Choosing contraception is a personal decision that impacts your health and well-being. From long-acting reversible contraceptives (LARCs) like the IUD or implant to daily options like the pill, this guide breaks down the efficacy, benefits, and side effects of each method. We also discuss how to discuss these options with your healthcare provider to find the perfect fit for your body and relationship status.",
            imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
            readTime: "6 min read"
        },
        {
            category: ResourceCategory.SAFE_SEX,
            title: "STIs 101: Knowledge is Power",
            description: "Break the stigma and learn the facts about transmission, testing, and treatment.",
            content: "Sexually transmitted infections (STIs) are common, yet often misunderstood. This article clarifies common myths, outlines the most frequent STIs seen on university campuses, and emphasizes why regular testing is a routine part of adult healthcare. Learn how to protect yourself and your partners through consistent barrier use and open communication.",
            imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.SAFE_SEX,
            title: "The Art of the 'Condom Conversation'",
            description: "How to bring up protection without ruining the mood.",
            content: "Talking about condoms doesn't have to be awkward. This guide provides practical scripts and confidence-boosting tips for discussing safe sex with a new partner. We explore how to set boundaries early and ensure that both people feel respected and protected before things heat up.",
            imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
        },
        {
            category: ResourceCategory.SAFE_SEX,
            title: "Emergency Contraception: When Things Don't Go to Plan",
            description: "Fast facts on the 'morning after' pill and what to do next.",
            content: "Accidents happen. Whether a condom broke or a dose of the pill was missed, emergency contraception (EC) provides a vital safety net. We detail the different types of EC available, their time sensitivity, and where you can access them discreetly and quickly on or near campus.",
            imageUrl: "https://images.unsplash.com/photo-1550572017-ed200159383b?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
        },
        {
            category: ResourceCategory.SAFE_SEX,
            title: "Beyond the Binary: Inclusive Safe Sex",
            description: "Protection strategies tailored for queer and gender-diverse relationships.",
            content: "Safe sex is for every body. This resource explores barrier methods like dental dams and gloves, alongside traditional condoms, focusing on the specific health needs and safety concerns of the LGBTQ+ community. Diversity in pleasure deserves diversity in protection.",
            imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
            readTime: "7 min read"
        },
        {
            category: ResourceCategory.SAFE_SEX,
            title: "The Science of Lubrication",
            description: "Why lube is a safe sex essential, not just an 'extra'.",
            content: "Lube reduces friction, which prevents condom breakage and micro-tears in the skin. This guide explains the differences between water-based, silicone-based, and oil-based lubricants, ensuring you choose the right one for your toy, your partner, and your protection method.",
            imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
            readTime: "3 min read"
        },
        {
            category: ResourceCategory.SAFE_SEX,
            title: "Digital Health: Tracking Your Cycle for Safety",
            description: "Using technology to understand your fertility and risk windows.",
            content: "Cycle tracking apps can be powerful tools for reproductive health. We discuss how to use these apps to monitor your body, while also highlighting the importance of using them in conjunction with other contraceptive methods for maximum reliability.",
            imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.SAFE_SEX,
            title: "PrEP and PEP: The New Era of HIV Prevention",
            description: "Understanding medical interventions that go beyond the barrier.",
            content: "Pre-Exposure Prophylaxis (PrEP) and Post-Exposure Prophylaxis (PEP) have revolutionized HIV prevention. This article explains how these medications work, who should consider them, and how to access them through student health services.",
            imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&w=800&q=80",
            readTime: "6 min read"
        },
        {
            category: ResourceCategory.SAFE_SEX,
            title: "Alcohol, Drugs, and Decisions",
            description: "Keeping your safe sex streak alive, even on a night out.",
            content: "Substance use can impact your judgment and ability to practice safe sex. We offer practical advice on how to plan ahead, look out for your friends, and ensure that your sexual health remains a priority, even when you're celebrating.",
            imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },

        // CONSENT (9)
        {
            category: ResourceCategory.CONSENT,
            title: "Consent: The F.R.I.E.S. Model Explained",
            description: "Learn why consent must be Freely given, Reversible, Informed, Enthusiastic, and Specific.",
            content: "Consent is more than a 'yes' or 'no'. The F.R.I.E.S. model, developed by Planned Parenthood, provides a clear framework for understanding healthy physical interactions. We dive deep into each pillar to help you navigate intimacy with clarity and respect for your partner's boundaries.",
            imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.CONSENT,
            title: "The Power of 'No' and the Beauty of 'Wait'",
            description: "Redefining rejection as a healthy boundary and a tool for trust.",
            content: "Hearing 'no' can be tough, but it's an essential part of any respectful relationship. We discuss how to receive a rejection with grace, why 'no' is a complete sentence, and how waiting can actually build deeper intimacy and trust between partners.",
            imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
        },
        {
            category: ResourceCategory.CONSENT,
            title: "Check-ins: Keeping the Vibe Right",
            description: "How to practice ongoing consent throughout an encounter.",
            content: "Consent isn't a one-time event; it's a continuous conversation. This guide offers simple, non-awkward check-in phrases like 'Do you like this?' or 'Should we slow down?' to ensure everyone remains on the same page and comfortable as things progress.",
            imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
            readTime: "3 min read"
        },
        {
            category: ResourceCategory.CONSENT,
            title: "Alcohol and Consent: Navigating the Gray Areas",
            description: "Why 'incapacitated' means 'incapable of consenting'.",
            content: "In university settings, alcohol is often involved in social life. This critical guide clarifies the legal and ethical boundaries of consent when drinking. We emphasize that someone who is significantly intoxicated cannot legally give consent, and how to look out for yourself and others in party environments.",
            imageUrl: "https://images.unsplash.com/photo-1514464750060-00e6e34c8b8c?auto=format&fit=crop&w=800&q=80",
            readTime: "6 min read"
        },
        {
            category: ResourceCategory.CONSENT,
            title: "Digital Boundaries: Consent in the Age of DMs",
            description: "Respecting privacy and boundaries in your digital interactions.",
            content: "Consent applies to digital spaces too. From sending (and receiving) explicit photos to tag requests and sharing private messages, we explore the ethics of digital intimacy and how to maintain respect in your online social life.",
            imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.CONSENT,
            title: "Consent Culture: Being an Active Bystander",
            description: "How to help create a safer campus for everyone.",
            content: "Creating a culture of consent is a community effort. This article teaches bystander intervention techniques, helping you recognize risky situations and step in safely to ensure the well-being of your peers. Your voice can make a difference.",
            imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
            readTime: "6 min read"
        },
        {
            category: ResourceCategory.CONSENT,
            title: "Navigating Long-Distance Consent",
            description: "Maintaining boundaries and respect when apart.",
            content: "Long-distance relationships bring unique challenges to intimacy. We discuss how to establish 'digital rules of engagement,' respect schedules, and ensure that both partners feel heard and valued, even when they aren't in the same room.",
            imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
        },
        {
            category: ResourceCategory.CONSENT,
            title: "Consent and Power Dynamics",
            description: "Recognizing when social pressure impacts the ability to say yes.",
            content: "Friend groups, seniority, and social status can create subtle pressures that complicate consent. We examine how to recognize these dynamics and ensure that every 'yes' is genuine and free from coercion or the desire to 'fit in.'",
            imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2959210?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.CONSENT,
            title: "The Aftercare Conversation",
            description: "Building trust and comfort after an encounter.",
            content: "What happens after an encounter is just as important as what happens during it. We discuss the concept of 'aftercare'—checking in on a partner's emotional and physical state after intimacy—to foster a culture of long-term care and respect.",
            imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
        },

        // MENTAL_HEALTH (9)
        {
            category: ResourceCategory.MENTAL_HEALTH,
            title: "Campus Stress: When 'Busy' Becomes 'Burnt Out'",
            description: "Recognizing the signs of academic burnout and how to reset.",
            content: "University life is demanding, but chronic stress can lead to serious burnout. This guide helps you identify physical and emotional red flags of overextension and provides practical strategies for setting boundaries with your work and reclaiming your peace.",
            imageUrl: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=800&q=80",
            readTime: "6 min read"
        },
        {
            category: ResourceCategory.MENTAL_HEALTH,
            title: "The Comparison Trap: Social Media and Your Mind",
            description: "Building a healthier relationship with your digital world.",
            content: "Instagram vs. Reality is a real struggle. We explore the psychological impact of constant comparison and offer tips for a 'digital detox,' curated feeds, and remembering that everyone's 'highlight reel' is just a tiny part of their story.",
            imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.MENTAL_HEALTH,
            title: "Sleep: The Ultimate Mental Health Tool",
            description: "Why your brain needs those 8 hours more than you think.",
            content: "All-nighters might seem like a student rite of passage, but they wreak havoc on your mental state. This article explains the science of sleep and mood regulation, offering a 'sleep hygiene' checklist to help you rest better and think clearer.",
            imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
        },
        {
            category: ResourceCategory.MENTAL_HEALTH,
            title: "Imposter Syndrome in the Classroom",
            description: "Owning your seat at the table and overcoming self-doubt.",
            content: "Do you ever feel like you don't belong here? You're not alone. Imposter syndrome affects even the highest achievers. We discuss how to challenge these thoughts and cultivate a growth mindset that celebrates your efforts, not just your grades.",
            imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.MENTAL_HEALTH,
            title: "Anxiety: From Butterflies to Panic Attacks",
            description: "Tools for managing the spectrum of anxious feelings.",
            content: "Anxiety is a common companion for students. Whether it's a presentation or a major life change, we provide grounding techniques, breathing exercises, and advice on when it's time to seek professional support from campus counseling.",
            imageUrl: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&w=800&q=80",
            readTime: "7 min read"
        },
        {
            category: ResourceCategory.MENTAL_HEALTH,
            title: "Grief and Loss on Campus",
            description: "Navigating big emotions while life keeps moving.",
            content: "Losing a loved one or a relationship during your studies can feel isolating. This gentle guide offers support for navigating grief, communicating your needs to professors, and finding space to heal amidst the noise of university life.",
            imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
            readTime: "6 min read"
        },
        {
            category: ResourceCategory.MENTAL_HEALTH,
            title: "Finding Your Flow: The Power of Hobbies",
            description: "Why doing things 'just for fun' is essential for your brain.",
            content: "When everything is graded, it's easy to forget the joy of pure creativity. We discuss how hobbies—whether it's painting, gaming, or gardening—can provide a vital 'flow state' that reduces stress and improves long-term mental resilience.",
            imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
        },
        {
            category: ResourceCategory.MENTAL_HEALTH,
            title: "Boundaries with Family and Friends",
            description: "Protecting your energy as you navigate your new adult life.",
            content: "Transitioning to university often means renegotiating relationships with family and old friends. We offer tips on how to set healthy boundaries, say 'no' to social pressure, and prioritize your own well-being as you grow and change.",
            imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2959210?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.MENTAL_HEALTH,
            title: "Seasonal Affective Disorder (SAD): Fighting the Winter Blues",
            description: "How to maintain your mood when the days get shorter.",
            content: "Winter can be tough on campus. If you find your mood dipping as the sun disappears, this article explains SAD and provides light therapy, movement, and social connection tips to help you through the darker months.",
            imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },

        // SEXUAL_WELLBEING (9)
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            title: "Self-Pleasure: A Path to Personal Discovery",
            description: "Why understanding your own body is the first step in wellness.",
            content: "Mastering your own pleasure is an important part of sexual health. This guide discusses the benefits of self-exploration for stress relief, body confidence, and becoming a more communicative and satisfied partner in future relationships.",
            imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            title: "Body Positivity and Intimacy",
            description: "Learning to love the skin you're in before (and during) sex.",
            content: "Body insecurity can be a major barrier to pleasure. We explore how to quiet your inner critic, celebrate your body's capabilities, and foster an environment of radical self-acceptance that translates into more confident and joyful intimate experiences.",
            imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            readTime: "6 min read"
        },
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            title: "The Emotional Side of Anatomy",
            description: "Understanding how your mind and body connect for pleasure.",
            content: "Sexual wellness isn't just physical. We look at how our emotions, past experiences, and current mental state impact our desire and response, offering holistic tools for a more integrated and fulfilling sexual life.",
            imageUrl: "https://images.unsplash.com/photo-1544006659-f0840bb71141?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            title: "Communicating Desires: More Than Just a Guessing Game",
            description: "How to tell your partner exactly what you like.",
            content: "Your partner isn't a mind reader. This article provides communication techniques for sharing your fantasies, likes, and dislikes, helping you build a more responsive and exciting sexual relationship through honest dialogue.",
            imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
        },
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            title: "The Wellness Routine: Beyond the Gym",
            description: "Why sexual health is a core pillar of your overall fitness.",
            content: "We track our steps and calories, but what about our sexual wellness? We discuss why prioritizing your intimate health—through checkups, pelvic floor health, and stress management—is essential for a balanced and high-functioning lifestyle.",
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            title: "Navigating Hookup Culture with Integrity",
            description: "How to enjoy casual encounters while keeping your wellness in mind.",
            content: "Casual sex can be a part of the university experience. We explore how to navigate this culture with self-respect, clear communication, and a focus on both physical safety and emotional clarity.",
            imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
            readTime: "6 min read"
        },
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            title: "Menstrual Health and Intimacy",
            description: "Understanding your cycle and how it impacts your desire.",
            content: "Hormonal shifts throughout your cycle can significantly affect your libido and sensitivity. This guide helps you map your cycle to understand your own patterns and navigate intimacy with greater ease and comfort.",
            imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            title: "Overcoming Insecurity: The 'First Time' Jitters",
            description: "Whether it's the actual first time or just a first time with someone new.",
            content: "Anxiety is natural before a new experience. We offer advice on how to slow down, communicate your needs, and focus on the connection rather than the 'performance' for a more relaxed and positive intimate start.",
            imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
            readTime: "5 min read"
        },
        {
            category: ResourceCategory.SEXUAL_WELLBEING,
            title: "The Science of Orgasm",
            description: "Understanding the biological 'why' and 'how' of pleasure.",
            content: "What actually happens to your brain and body during a peak experience? We dive into the physiology of pleasure, debunking myths and explaining the stress-reducing benefits of a healthy sexual response.",
            imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
            readTime: "4 min read"
        }
    ];

    await prisma.resource.createMany({
        data: resourceData
    });

    console.log('Resources created.');

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
    await prisma.appointment.create({
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