import { prisma } from '../config/db.js';

export const getAllTestKits = async () => {
  return prisma.testKit.findMany({
    where: {
      active: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
};

export const getTestKitById = async (id: bigint) => {
  return prisma.testKit.findUnique({
    where: { id },
  });
};
