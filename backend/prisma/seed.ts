import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const baseTime = new Date("2024-01-15T10:00:00Z");
const addDays = (days: number) => new Date(baseTime.getTime() + days * 24 * 60 * 60 * 1000);
const addHours = (hours: number) => new Date(baseTime.getTime() + hours * 60 * 60 * 1000);

async function main() {
  await prisma.statusShare.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.userCurrentStatus.deleteMany();
  await prisma.userVerification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.testKit.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.appointmentSlot.deleteMany();
  await prisma.practitionerClinic.deleteMany();
  await prisma.practitioner.deleteMany();
  await prisma.clinicStaff.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.testType.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      { username: "practitioner.alex", email: "alex@sti.test", passwordHash: "hash_alex", status: "active" },
      { username: "practitioner.bella", email: "bella@sti.test", passwordHash: "hash_bella", status: "active" },
      { username: "practitioner.chen", email: "chen@sti.test", passwordHash: "hash_chen", status: "active" },
      { username: "practitioner.dina", email: "dina@sti.test", passwordHash: "hash_dina", status: "active" },
      { username: "practitioner.emil", email: "emil@sti.test", passwordHash: "hash_emil", status: "active" },
      { username: "practitioner.farah", email: "farah@sti.test", passwordHash: "hash_farah", status: "active" },
      { username: "admin.grace", email: "grace@sti.test", passwordHash: "hash_grace", status: "active" },
      { username: "admin.hugo", email: "hugo@sti.test", passwordHash: "hash_hugo", status: "active" },
      { username: "staff.iris", email: "iris@sti.test", passwordHash: "hash_iris", status: "active" },
      { username: "staff.jon", email: "jon@sti.test", passwordHash: "hash_jon", status: "active" },
      { username: "staff.kai", email: "kai@sti.test", passwordHash: "hash_kai", status: "active" },
      { username: "staff.lena", email: "lena@sti.test", passwordHash: "hash_lena", status: "active" },
      { username: "user.maya", email: "maya@sti.test", passwordHash: "hash_maya", status: "active" },
      { username: "user.nolan", email: "nolan@sti.test", passwordHash: "hash_nolan", status: "active" },
      { username: "user.olive", email: "olive@sti.test", passwordHash: "hash_olive", status: "active" }
    ]
  });

  const users = await prisma.user.findMany();
  const userByUsername = Object.fromEntries(users.map((user) => [user.username, user]));

  await prisma.userProfile.createMany({
    data: [
      { userId: userByUsername["practitioner.alex"].id, gender: "male", ageRange: "30-39", preferredPartnerGender: "female", address: "12 Beacon St" },
      { userId: userByUsername["practitioner.bella"].id, gender: "female", ageRange: "30-39", preferredPartnerGender: "male", address: "98 Harbor Rd" },
      { userId: userByUsername["practitioner.chen"].id, gender: "male", ageRange: "40-49", preferredPartnerGender: "female", address: "27 Lake View" },
      { userId: userByUsername["practitioner.dina"].id, gender: "female", ageRange: "30-39", preferredPartnerGender: "male", address: "54 Pine Ave" },
      { userId: userByUsername["practitioner.emil"].id, gender: "male", ageRange: "40-49", preferredPartnerGender: "female", address: "3 Garden Walk" },
      { userId: userByUsername["practitioner.farah"].id, gender: "female", ageRange: "30-39", preferredPartnerGender: "male", address: "6 Elm Row" },
      { userId: userByUsername["admin.grace"].id, gender: "female", ageRange: "40-49", preferredPartnerGender: "female", address: "1 River Blvd" },
      { userId: userByUsername["admin.hugo"].id, gender: "male", ageRange: "40-49", preferredPartnerGender: "female", address: "22 Coastline Rd" },
      { userId: userByUsername["staff.iris"].id, gender: "female", ageRange: "20-29", preferredPartnerGender: "male", address: "19 Orchard St" },
      { userId: userByUsername["staff.jon"].id, gender: "male", ageRange: "20-29", preferredPartnerGender: "female", address: "71 Hillcrest" },
      { userId: userByUsername["staff.kai"].id, gender: "nonbinary", ageRange: "20-29", preferredPartnerGender: "male", address: "88 Valley Rd" },
      { userId: userByUsername["staff.lena"].id, gender: "female", ageRange: "30-39", preferredPartnerGender: "female", address: "11 Market St" },
      { userId: userByUsername["user.maya"].id, gender: "female", ageRange: "20-29", preferredPartnerGender: "male", address: "5 Sunrise Blvd" },
      { userId: userByUsername["user.nolan"].id, gender: "male", ageRange: "20-29", preferredPartnerGender: "female", address: "9 Sunset Ave" },
      { userId: userByUsername["user.olive"].id, gender: "female", ageRange: "30-39", preferredPartnerGender: "male", address: "18 River Walk" }
    ]
  });

  await prisma.clinic.createMany({
    data: [
      { name: "Downtown Health Clinic", address: "100 Main St", lat: 6.9271, lng: 79.8612, availableTime: "Mon-Fri 8am-6pm", createdAt: addDays(-20) },
      { name: "Lakeside Wellness", address: "42 Lake Rd", lat: 6.875, lng: 79.9, availableTime: "Mon-Sat 9am-5pm", createdAt: addDays(-18) },
      { name: "Harbor Care Center", address: "77 Harbor Way", lat: 6.9, lng: 79.85, availableTime: "Tue-Sun 10am-7pm", createdAt: addDays(-16) },
      { name: "Greenfield Clinic", address: "15 Greenfield Ave", lat: 6.91, lng: 79.88, availableTime: "Mon-Fri 7am-3pm", createdAt: addDays(-14) },
      { name: "Eastside Medical", address: "200 East St", lat: 6.935, lng: 79.89, availableTime: "Mon-Sat 8am-4pm", createdAt: addDays(-12) },
      { name: "Hilltop Diagnostics", address: "9 Hilltop Rd", lat: 6.94, lng: 79.83, availableTime: "Mon-Fri 9am-5pm", createdAt: addDays(-10) }
    ]
  });

  const clinics = await prisma.clinic.findMany({ orderBy: { id: "asc" } });

  await prisma.clinicStaff.createMany({
    data: [
      { clinicId: clinics[0].id, userId: userByUsername["admin.grace"].id, role: "clinic_admin", createdAt: addDays(-15) },
      { clinicId: clinics[1].id, userId: userByUsername["admin.hugo"].id, role: "clinic_admin", createdAt: addDays(-14) },
      { clinicId: clinics[0].id, userId: userByUsername["staff.iris"].id, role: "staff", createdAt: addDays(-13) },
      { clinicId: clinics[2].id, userId: userByUsername["staff.jon"].id, role: "staff", createdAt: addDays(-12) },
      { clinicId: clinics[3].id, userId: userByUsername["staff.kai"].id, role: "staff", createdAt: addDays(-11) },
      { clinicId: clinics[4].id, userId: userByUsername["staff.lena"].id, role: "staff", createdAt: addDays(-10) },
      { clinicId: clinics[5].id, userId: userByUsername["staff.iris"].id, role: "staff", createdAt: addDays(-9) },
      { clinicId: clinics[2].id, userId: userByUsername["staff.lena"].id, role: "staff", createdAt: addDays(-8) }
    ]
  });

  await prisma.practitioner.createMany({
    data: [
      { userId: userByUsername["practitioner.alex"].id, name: "Dr. Alex Perera", specialization: "Infectious Disease", regNo: "REG-1001", createdAt: addDays(-30) },
      { userId: userByUsername["practitioner.bella"].id, name: "Dr. Bella Silva", specialization: "Sexual Health", regNo: "REG-1002", createdAt: addDays(-28) },
      { userId: userByUsername["practitioner.chen"].id, name: "Dr. Chen Kumar", specialization: "Dermatology", regNo: "REG-1003", createdAt: addDays(-26) },
      { userId: userByUsername["practitioner.dina"].id, name: "Dr. Dina Jay", specialization: "Public Health", regNo: "REG-1004", createdAt: addDays(-24) },
      { userId: userByUsername["practitioner.emil"].id, name: "Dr. Emil Tan", specialization: "Infectious Disease", regNo: "REG-1005", createdAt: addDays(-22) },
      { userId: userByUsername["practitioner.farah"].id, name: "Dr. Farah Ali", specialization: "Sexual Health", regNo: "REG-1006", createdAt: addDays(-20) }
    ]
  });

  const practitioners = await prisma.practitioner.findMany({ orderBy: { id: "asc" } });

  await prisma.practitionerClinic.createMany({
    data: [
      { practitionerId: practitioners[0].id, clinicId: clinics[0].id },
      { practitionerId: practitioners[1].id, clinicId: clinics[1].id },
      { practitionerId: practitioners[2].id, clinicId: clinics[2].id },
      { practitionerId: practitioners[3].id, clinicId: clinics[3].id },
      { practitionerId: practitioners[4].id, clinicId: clinics[4].id },
      { practitionerId: practitioners[5].id, clinicId: clinics[5].id },
      { practitionerId: practitioners[0].id, clinicId: clinics[2].id },
      { practitionerId: practitioners[1].id, clinicId: clinics[3].id }
    ]
  });

  await prisma.appointmentSlot.createMany({
    data: [
      {
        practitionerId: practitioners[0].id,
        clinicId: clinics[0].id,
        mode: "physical",
        startsAt: addDays(3),
        endsAt: addDays(3.5),
        priceCents: 4500,
        isAvailable: true,
        createdAt: addDays(-5)
      },
      {
        practitionerId: practitioners[0].id,
        clinicId: null,
        mode: "online",
        startsAt: addDays(4),
        endsAt: addDays(4.5),
        priceCents: 3500,
        isAvailable: true,
        createdAt: addDays(-5)
      },
      {
        practitionerId: practitioners[1].id,
        clinicId: clinics[1].id,
        mode: "physical",
        startsAt: addDays(5),
        endsAt: addDays(5.5),
        priceCents: 5000,
        isAvailable: true,
        createdAt: addDays(-4)
      },
      {
        practitionerId: practitioners[1].id,
        clinicId: null,
        mode: "online",
        startsAt: addDays(6),
        endsAt: addDays(6.5),
        priceCents: 3000,
        isAvailable: true,
        createdAt: addDays(-4)
      },
      {
        practitionerId: practitioners[2].id,
        clinicId: clinics[2].id,
        mode: "physical",
        startsAt: addDays(7),
        endsAt: addDays(7.5),
        priceCents: 4200,
        isAvailable: true,
        createdAt: addDays(-3)
      },
      {
        practitionerId: practitioners[2].id,
        clinicId: null,
        mode: "online",
        startsAt: addDays(8),
        endsAt: addDays(8.5),
        priceCents: 2800,
        isAvailable: true,
        createdAt: addDays(-3)
      },
      {
        practitionerId: practitioners[3].id,
        clinicId: clinics[3].id,
        mode: "physical",
        startsAt: addDays(9),
        endsAt: addDays(9.5),
        priceCents: 4700,
        isAvailable: true,
        createdAt: addDays(-2)
      },
      {
        practitionerId: practitioners[3].id,
        clinicId: null,
        mode: "online",
        startsAt: addDays(10),
        endsAt: addDays(10.5),
        priceCents: 3200,
        isAvailable: true,
        createdAt: addDays(-2)
      },
      {
        practitionerId: practitioners[4].id,
        clinicId: clinics[4].id,
        mode: "physical",
        startsAt: addDays(11),
        endsAt: addDays(11.5),
        priceCents: 5200,
        isAvailable: true,
        createdAt: addDays(-1)
      },
      {
        practitionerId: practitioners[4].id,
        clinicId: null,
        mode: "online",
        startsAt: addDays(12),
        endsAt: addDays(12.5),
        priceCents: 3100,
        isAvailable: true,
        createdAt: addDays(-1)
      },
      {
        practitionerId: practitioners[5].id,
        clinicId: clinics[5].id,
        mode: "physical",
        startsAt: addDays(13),
        endsAt: addDays(13.5),
        priceCents: 4800,
        isAvailable: true,
        createdAt: addDays(-1)
      },
      {
        practitionerId: practitioners[5].id,
        clinicId: null,
        mode: "online",
        startsAt: addDays(14),
        endsAt: addDays(14.5),
        priceCents: 3300,
        isAvailable: true,
        createdAt: addDays(-1)
      }
    ]
  });

  const slots = await prisma.appointmentSlot.findMany({ orderBy: { id: "asc" } });

  await prisma.appointment.createMany({
    data: [
      { userId: userByUsername["user.maya"].id, slotId: slots[0].id, status: "booked", createdAt: addDays(-2) },
      { userId: userByUsername["user.nolan"].id, slotId: slots[1].id, status: "cancelled", createdAt: addDays(-3) },
      { userId: userByUsername["user.olive"].id, slotId: slots[2].id, status: "completed", createdAt: addDays(-4) },
      { userId: userByUsername["user.maya"].id, slotId: slots[3].id, status: "no_show", createdAt: addDays(-5) },
      { userId: userByUsername["user.nolan"].id, slotId: slots[4].id, status: "booked", createdAt: addDays(-6) },
      { userId: userByUsername["user.olive"].id, slotId: slots[5].id, status: "completed", createdAt: addDays(-7) }
    ]
  });

  await prisma.testType.createMany({
    data: [
      { name: "HIV", category: "Viral", active: true },
      { name: "Syphilis", category: "Bacterial", active: true },
      { name: "Gonorrhea", category: "Bacterial", active: true },
      { name: "Chlamydia", category: "Bacterial", active: true },
      { name: "Hep B", category: "Viral", active: true },
      { name: "Hep C", category: "Viral", active: true }
    ]
  });

  const testTypes = await prisma.testType.findMany({ orderBy: { id: "asc" } });

  await prisma.userVerification.createMany({
    data: [
      {
        userId: userByUsername["user.maya"].id,
        testTypeId: testTypes[0].id,
        clinicId: clinics[0].id,
        verifiedByUserId: userByUsername["staff.iris"].id,
        status: "verified",
        testedAt: addDays(-30),
        verifiedAt: addDays(-29),
        createdAt: addDays(-29)
      },
      {
        userId: userByUsername["user.maya"].id,
        testTypeId: testTypes[1].id,
        clinicId: clinics[1].id,
        verifiedByUserId: userByUsername["staff.jon"].id,
        status: "unverified",
        testedAt: addDays(-10),
        verifiedAt: null,
        createdAt: addDays(-10)
      },
      {
        userId: userByUsername["user.nolan"].id,
        testTypeId: testTypes[2].id,
        clinicId: clinics[2].id,
        verifiedByUserId: userByUsername["staff.kai"].id,
        status: "verified",
        testedAt: addDays(-20),
        verifiedAt: addDays(-19),
        createdAt: addDays(-19)
      },
      {
        userId: userByUsername["user.nolan"].id,
        testTypeId: testTypes[3].id,
        clinicId: clinics[3].id,
        verifiedByUserId: userByUsername["staff.lena"].id,
        status: "verified",
        testedAt: addDays(-15),
        verifiedAt: addDays(-14),
        createdAt: addDays(-14)
      },
      {
        userId: userByUsername["user.olive"].id,
        testTypeId: testTypes[4].id,
        clinicId: clinics[4].id,
        verifiedByUserId: userByUsername["admin.grace"].id,
        status: "unverified",
        testedAt: addDays(-12),
        verifiedAt: null,
        createdAt: addDays(-12)
      },
      {
        userId: userByUsername["user.olive"].id,
        testTypeId: testTypes[5].id,
        clinicId: clinics[5].id,
        verifiedByUserId: userByUsername["admin.hugo"].id,
        status: "verified",
        testedAt: addDays(-40),
        verifiedAt: addDays(-39),
        createdAt: addDays(-39)
      },
      {
        userId: userByUsername["staff.iris"].id,
        testTypeId: testTypes[0].id,
        clinicId: clinics[0].id,
        verifiedByUserId: userByUsername["admin.grace"].id,
        status: "verified",
        testedAt: addDays(-25),
        verifiedAt: addDays(-24),
        createdAt: addDays(-24)
      },
      {
        userId: userByUsername["staff.jon"].id,
        testTypeId: testTypes[1].id,
        clinicId: clinics[1].id,
        verifiedByUserId: userByUsername["admin.hugo"].id,
        status: "unverified",
        testedAt: addDays(-9),
        verifiedAt: null,
        createdAt: addDays(-9)
      },
      {
        userId: userByUsername["staff.kai"].id,
        testTypeId: testTypes[2].id,
        clinicId: clinics[2].id,
        verifiedByUserId: userByUsername["staff.jon"].id,
        status: "verified",
        testedAt: addDays(-18),
        verifiedAt: addDays(-17),
        createdAt: addDays(-17)
      },
      {
        userId: userByUsername["staff.lena"].id,
        testTypeId: testTypes[3].id,
        clinicId: clinics[3].id,
        verifiedByUserId: userByUsername["staff.iris"].id,
        status: "verified",
        testedAt: addDays(-21),
        verifiedAt: addDays(-20),
        createdAt: addDays(-20)
      },
      {
        userId: userByUsername["practitioner.alex"].id,
        testTypeId: testTypes[4].id,
        clinicId: clinics[4].id,
        verifiedByUserId: userByUsername["admin.grace"].id,
        status: "verified",
        testedAt: addDays(-23),
        verifiedAt: addDays(-22),
        createdAt: addDays(-22)
      },
      {
        userId: userByUsername["practitioner.bella"].id,
        testTypeId: testTypes[5].id,
        clinicId: clinics[5].id,
        verifiedByUserId: userByUsername["admin.hugo"].id,
        status: "unverified",
        testedAt: addDays(-8),
        verifiedAt: null,
        createdAt: addDays(-8)
      }
    ]
  });

  await prisma.userCurrentStatus.createMany({
    data: [
      { userId: userByUsername["practitioner.alex"].id, status: "verified", lastVerifiedAt: addDays(-22) },
      { userId: userByUsername["practitioner.bella"].id, status: "unverified", lastVerifiedAt: addDays(-39) },
      { userId: userByUsername["practitioner.chen"].id, status: "unverified", lastVerifiedAt: null },
      { userId: userByUsername["practitioner.dina"].id, status: "unverified", lastVerifiedAt: null },
      { userId: userByUsername["practitioner.emil"].id, status: "unverified", lastVerifiedAt: null },
      { userId: userByUsername["practitioner.farah"].id, status: "unverified", lastVerifiedAt: null },
      { userId: userByUsername["admin.grace"].id, status: "unverified", lastVerifiedAt: null },
      { userId: userByUsername["admin.hugo"].id, status: "unverified", lastVerifiedAt: null },
      { userId: userByUsername["staff.iris"].id, status: "verified", lastVerifiedAt: addDays(-24) },
      { userId: userByUsername["staff.jon"].id, status: "unverified", lastVerifiedAt: null },
      { userId: userByUsername["staff.kai"].id, status: "verified", lastVerifiedAt: addDays(-17) },
      { userId: userByUsername["staff.lena"].id, status: "verified", lastVerifiedAt: addDays(-20) },
      { userId: userByUsername["user.maya"].id, status: "unverified", lastVerifiedAt: addDays(-29) },
      { userId: userByUsername["user.nolan"].id, status: "verified", lastVerifiedAt: addDays(-14) },
      { userId: userByUsername["user.olive"].id, status: "verified", lastVerifiedAt: addDays(-39) }
    ]
  });

  await prisma.partner.createMany({
    data: [
      { sharedByUserId: userByUsername["user.maya"].id, receivedByUserId: userByUsername["user.nolan"].id, status: "pending", createdAt: addDays(-5) },
      { sharedByUserId: userByUsername["user.olive"].id, receivedByUserId: userByUsername["user.maya"].id, status: "accepted", createdAt: addDays(-12), acceptedAt: addDays(-10) },
      { sharedByUserId: userByUsername["staff.iris"].id, receivedByUserId: userByUsername["staff.jon"].id, status: "rejected", createdAt: addDays(-6) },
      { sharedByUserId: userByUsername["staff.kai"].id, receivedByUserId: userByUsername["staff.lena"].id, status: "blocked", createdAt: addDays(-9) },
      { sharedByUserId: userByUsername["practitioner.alex"].id, receivedByUserId: userByUsername["practitioner.bella"].id, status: "accepted", createdAt: addDays(-15), acceptedAt: addDays(-13) },
      { sharedByUserId: userByUsername["admin.grace"].id, receivedByUserId: userByUsername["admin.hugo"].id, status: "pending", createdAt: addDays(-3) }
    ]
  });

  await prisma.statusShare.createMany({
    data: [
      {
        senderUserId: userByUsername["user.maya"].id,
        recipientUserId: userByUsername["user.nolan"].id,
        recipientUsernameSnapshot: "user.nolan",
        tokenHash: "a3d1f6e9c4b2a1f0a3d1f6e9c4b2a1f0a3d1f6e9c4b2a1f0a3d1f6e9c4b2a1f0",
        createdAt: addDays(-2),
        expiresAt: addDays(1),
        viewedAt: addDays(-1),
        revokedAt: null,
        maxViews: 1,
        viewCount: 1
      },
      {
        senderUserId: userByUsername["user.nolan"].id,
        recipientUserId: userByUsername["user.olive"].id,
        recipientUsernameSnapshot: "user.olive",
        tokenHash: "b4e2c7d8f9a0b4e2c7d8f9a0b4e2c7d8f9a0b4e2c7d8f9a0b4e2c7d8f9a0b4e2",
        createdAt: addDays(-3),
        expiresAt: addDays(2),
        viewedAt: null,
        revokedAt: null,
        maxViews: 2,
        viewCount: 0
      },
      {
        senderUserId: userByUsername["user.olive"].id,
        recipientUserId: null,
        recipientUsernameSnapshot: "guest.user",
        tokenHash: "c5f1d2e3a4b5c5f1d2e3a4b5c5f1d2e3a4b5c5f1d2e3a4b5c5f1d2e3a4b5c5f1",
        createdAt: addDays(-6),
        expiresAt: addDays(-1),
        viewedAt: addDays(-5),
        revokedAt: null,
        maxViews: 1,
        viewCount: 1
      },
      {
        senderUserId: userByUsername["staff.iris"].id,
        recipientUserId: userByUsername["staff.jon"].id,
        recipientUsernameSnapshot: "staff.jon",
        tokenHash: "d6e3f4a5b6c7d6e3f4a5b6c7d6e3f4a5b6c7d6e3f4a5b6c7d6e3f4a5b6c7d6e3",
        createdAt: addDays(-4),
        expiresAt: addDays(1),
        viewedAt: null,
        revokedAt: addDays(-2),
        maxViews: 1,
        viewCount: 0
      },
      {
        senderUserId: userByUsername["admin.grace"].id,
        recipientUserId: null,
        recipientUsernameSnapshot: "clinic_partner",
        tokenHash: "e7f4a5b6c7d8e7f4a5b6c7d8e7f4a5b6c7d8e7f4a5b6c7d8e7f4a5b6c7d8e7f4",
        createdAt: addDays(-1),
        expiresAt: addDays(3),
        viewedAt: null,
        revokedAt: null,
        maxViews: 3,
        viewCount: 1
      },
      {
        senderUserId: userByUsername["admin.hugo"].id,
        recipientUserId: userByUsername["user.maya"].id,
        recipientUsernameSnapshot: "user.maya",
        tokenHash: "f8a5b6c7d8e9f8a5b6c7d8e9f8a5b6c7d8e9f8a5b6c7d8e9f8a5b6c7d8e9f8a5",
        createdAt: addDays(-7),
        expiresAt: addDays(-2),
        viewedAt: addDays(-6),
        revokedAt: null,
        maxViews: 1,
        viewCount: 1
      }
    ]
  });

  await prisma.testKit.createMany({
    data: [
      { name: "HIV Rapid Kit", priceCents: 2500, description: "At-home HIV rapid test", active: true },
      { name: "Syphilis Check Kit", priceCents: 2000, description: "Syphilis home test", active: true },
      { name: "Gonorrhea Panel", priceCents: 3000, description: "Gonorrhea urine test", active: true },
      { name: "Chlamydia Panel", priceCents: 2800, description: "Chlamydia urine test", active: true },
      { name: "Hep B Home Kit", priceCents: 2600, description: "Hepatitis B kit", active: true },
      { name: "Hep C Home Kit", priceCents: 2700, description: "Hepatitis C kit", active: true }
    ]
  });

  const testKits = await prisma.testKit.findMany({ orderBy: { id: "asc" } });

  await prisma.order.createMany({
    data: [
      { userId: userByUsername["user.maya"].id, deliveryAddress: "5 Sunrise Blvd", status: "created", createdAt: addDays(-3) },
      { userId: userByUsername["user.nolan"].id, deliveryAddress: "9 Sunset Ave", status: "paid", createdAt: addDays(-4) },
      { userId: userByUsername["user.olive"].id, deliveryAddress: "18 River Walk", status: "shipped", createdAt: addDays(-5) },
      { userId: userByUsername["staff.iris"].id, deliveryAddress: "19 Orchard St", status: "delivered", createdAt: addDays(-6) },
      { userId: userByUsername["staff.jon"].id, deliveryAddress: "71 Hillcrest", status: "cancelled", createdAt: addDays(-7) },
      { userId: userByUsername["staff.kai"].id, deliveryAddress: "88 Valley Rd", status: "paid", createdAt: addDays(-8) }
    ]
  });

  const orders = await prisma.order.findMany({ orderBy: { id: "asc" } });

  await prisma.orderItem.createMany({
    data: [
      { orderId: orders[0].id, testKitId: testKits[0].id, qty: 1, unitPriceCents: 2500 },
      { orderId: orders[0].id, testKitId: testKits[1].id, qty: 2, unitPriceCents: 2000 },
      { orderId: orders[1].id, testKitId: testKits[2].id, qty: 1, unitPriceCents: 3000 },
      { orderId: orders[1].id, testKitId: testKits[3].id, qty: 1, unitPriceCents: 2800 },
      { orderId: orders[2].id, testKitId: testKits[4].id, qty: 2, unitPriceCents: 2600 },
      { orderId: orders[2].id, testKitId: testKits[5].id, qty: 1, unitPriceCents: 2700 },
      { orderId: orders[3].id, testKitId: testKits[0].id, qty: 1, unitPriceCents: 2500 },
      { orderId: orders[3].id, testKitId: testKits[2].id, qty: 1, unitPriceCents: 3000 },
      { orderId: orders[4].id, testKitId: testKits[1].id, qty: 1, unitPriceCents: 2000 },
      { orderId: orders[4].id, testKitId: testKits[3].id, qty: 2, unitPriceCents: 2800 },
      { orderId: orders[5].id, testKitId: testKits[4].id, qty: 1, unitPriceCents: 2600 },
      { orderId: orders[5].id, testKitId: testKits[5].id, qty: 1, unitPriceCents: 2700 }
    ]
  });

  const appointments = await prisma.appointment.findMany({ orderBy: { id: "asc" } });

  await prisma.payment.createMany({
    data: [
      { orderId: orders[0].id, appointmentId: null, payhereReference: "PH-ORDER-1001", amountCents: 6500, status: "initiated", createdAt: addDays(-3) },
      { orderId: orders[1].id, appointmentId: null, payhereReference: "PH-ORDER-1002", amountCents: 5800, status: "paid", createdAt: addDays(-4) },
      { orderId: orders[2].id, appointmentId: null, payhereReference: "PH-ORDER-1003", amountCents: 7900, status: "paid", createdAt: addDays(-5) },
      { orderId: null, appointmentId: appointments[0].id, payhereReference: "PH-APPT-2001", amountCents: 4500, status: "paid", createdAt: addDays(-2) },
      { orderId: null, appointmentId: appointments[2].id, payhereReference: "PH-APPT-2002", amountCents: 5000, status: "failed", createdAt: addDays(-4) },
      { orderId: orders[3].id, appointmentId: null, payhereReference: "PH-ORDER-1004", amountCents: 5500, status: "refunded", createdAt: addDays(-6) }
    ]
  });

  await prisma.shipment.createMany({
    data: [
      { orderId: orders[0].id, carrier: "DHL", trackingNumber: "DHL-001", status: "packed", shippedAt: null, deliveredAt: null },
      { orderId: orders[1].id, carrier: "FedEx", trackingNumber: "FDX-002", status: "shipped", shippedAt: addDays(-2), deliveredAt: null },
      { orderId: orders[2].id, carrier: "UPS", trackingNumber: "UPS-003", status: "delivered", shippedAt: addDays(-4), deliveredAt: addDays(-1) },
      { orderId: orders[3].id, carrier: "DHL", trackingNumber: "DHL-004", status: "delivered", shippedAt: addDays(-5), deliveredAt: addDays(-3) },
      { orderId: orders[4].id, carrier: "FedEx", trackingNumber: "FDX-005", status: "packed", shippedAt: null, deliveredAt: null },
      { orderId: orders[5].id, carrier: "UPS", trackingNumber: "UPS-006", status: "shipped", shippedAt: addDays(-1), deliveredAt: null }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
