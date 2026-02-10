import { prisma } from '../config/db.js';

export const getAllClinics = async () => {
  return prisma.clinics.findMany();
};

export const getClinicById = async (id: bigint) => {
  return prisma.clinics.findUnique({
    where: { id },
  });
};

export const searchClinicsByName = async (name: string) => {
  return prisma.clinics.findMany({
    where: {
      name: { contains: name, mode: 'insensitive' },
    },
  });
};

export const getClinicBySlug = async (slug: string) => {
  return prisma.clinics.findUnique({
    where: { slug },
  });
};

export const getStaffDashboardData = async (clinicId: bigint) => {
  // Fetch stats concurrently
  const [pendingCount, verifiedTodayCount] = await Promise.all([
    prisma.user_verifications.count({
      where: {
        clinicId,
        status: "processing",
      },
    }),
    prisma.user_verifications.count({
      where: {
        clinicId,
        status: "verified",
        verifiedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  // Fetch recent submissions
  const submissions = await prisma.user_verifications.findMany({
    where: {
      clinicId: clinicId,
    },
    include: {
      user: true,
      testKit: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return {
    stats: {
      pending: pendingCount,
      verifiedToday: verifiedTodayCount,
      avgTurnaround: "1.2 hrs",
    },
    submissions: submissions.map(s => ({
      id: s.id.toString(),
      patientUuid: s.user.username,
      testType: s.testKit.name,
      status: s.status,
      createdAt: s.createdAt.toISOString(),
    })),
  };
};