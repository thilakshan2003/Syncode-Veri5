import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const updateProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - user is attached by authMiddleware
        const userId = req.user.id;
        const { username, gender, ageRange, address } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username,
                gender: gender || null,
                ageRange: ageRange || null,
                address: address || null,
            },
            select: {
                id: true,
                username: true,
                email: true,
                status: true,
                gender: true,
                ageRange: true,
                address: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Username already taken' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
