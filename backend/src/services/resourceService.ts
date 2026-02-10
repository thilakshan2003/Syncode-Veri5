import { ResourceCategory } from '../../generated/prisma/enums.js';
import { serializeBigInt } from '../utils/serialization.js';
import { prisma } from '../config/db.js';

export const ResourceService = {
    /**
     * Fetches resources from the database based on the provided category.
     * If no category is provided, it returns all resources.
     * 
     * @param category - The ResourceCategory to filter by.
     * @returns A promise that resolves to an array of serialized resources.
     */
    async getResourcesByCategory(category?: string) {
        const where: any = {};
        if (category && Object.values(ResourceCategory).includes(category as ResourceCategory)) {
            where.category = category as ResourceCategory;
        }

        const resources = await prisma.resource.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return serializeBigInt(resources);
    },

    /**
     * Fetches a single resource by its ID.
     * 
     * @param id - The ID of the resource to fetch.
     * @returns A promise that resolves to the serialized resource or null if not found.
     */
    async getResourceById(id: string) {
        const resource = await prisma.resource.findUnique({
            where: { id }
        });

        if (!resource) return null;

        return serializeBigInt(resource);
    }
};