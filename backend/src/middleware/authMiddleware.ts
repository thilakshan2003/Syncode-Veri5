import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { config } from '../config/env.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string };
        const user = await prisma.user.findUnique({
            where: { id: BigInt(decoded.userId) },
        });

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // @ts-ignore - Extending Request type typically requires declaration merging, 
        // defaulting to attaching property for simplicity in this scope.
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
};
