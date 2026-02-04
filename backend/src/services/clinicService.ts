import { prisma } from '../config/db.js';

export const getAllClinics = async () => {
  return prisma.clinic.findMany();
};

export const getClinicById = async (id: bigint) => {
  return prisma.clinic.findUnique({
    where: { id },
  });
};

export const searchClinicsByName = async (name: string) => {
  return prisma.clinic.findMany({
    where: {
      name: { contains: name, mode: 'insensitive' },
    },
  });
};