import { prisma } from '../config/db.js';

/**
 * Get all active test types
 * @returns Array of active test types
 */
export const getAllTestTypes = async () => {
    const testTypes = await prisma.test_kits.findMany({
        where: {
            active: true,
        },
        select: {
            id: true,
            name: true,
            description: true,
            priceCents: true,
        },
        orderBy: {
            name: 'asc',
        },
    });

    return testTypes;
};

// /**
//  * Get test type by ID
//  * @param id - Test type ID
//  * @returns Test type or null
//  */
// export const getTestTypeById = async (id: bigint) => {
//     const testType = await prisma.testType.findUnique({
//         where: {
//             id,
//             active: true,
//         },
//         select: {
//             id: true,
//             name: true,
//             category: true,
//         },
//     });

//     return testType;
// };
