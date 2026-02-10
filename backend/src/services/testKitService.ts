import { prisma } from '../config/db.js';

export const getAllTestKits = async () => {
  return prisma.test_kits.findMany({
    where: {
      active: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

export const getTestKitById = async (id: bigint) => {
  return prisma.test_kits.findUnique({
    where: { id },
  });
};
