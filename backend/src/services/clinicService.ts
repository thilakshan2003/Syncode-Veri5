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
      OR: [
        { name: { contains: name, mode: 'insensitive' } },
        { address: { contains: name, mode: 'insensitive' } },
      ],
    },
  });
};