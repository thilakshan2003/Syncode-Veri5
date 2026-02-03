import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { config } from '../config/env.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    // Extract token from Authorization header or cookies
    const token = req.cookies?.accessToken;

    // If no token, respond with 401
    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    try {
        // Verify token, done by checking signature and expiration
        // If valid, extract user ID from payload
        // The math involved here is pretty cool, me likey - Thilakshan
        // Yes im actually going through all the code 
        const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string };
        const user = await prisma.user.findUnique({
            where: { id: BigInt(decoded.userId) },
        });

        if (!user) {
            res.status(401).json({ error: 'User not found' }); //When user not found
            return;
        }

        // @ts-ignore - Extending Request type typically requires declaration merging, 
        // defaulting to attaching property for simplicity in this scope.
        req.user = user;
        next();
    } catch (error) {
        //Expired or invalid token
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
};
