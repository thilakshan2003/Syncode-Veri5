import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../config/db.js';
import { config } from '../config/env.js';
import { signupSchema, loginSchema } from '../utils/validationSchemas.js';
import { z } from 'zod';

const client = new OAuth2Client(config.google.clientId);

// Token generation helpers
const generateTokens = (userId: bigint) => {
    const accessToken = jwt.sign({ userId: userId.toString() }, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiresIn,
    } as jwt.SignOptions);
    const refreshToken = jwt.sign({ userId: userId.toString() }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);
    return { accessToken, refreshToken };
};

export class AuthService {
    async signup(data: z.infer<typeof signupSchema>) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
        if (existingUsername) {
            throw new Error('Username already taken');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const newUser = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                passwordHash,
                gender: data.gender ?? null,
                ageRange: data.ageRange ?? null,
                address: data.address ?? null,
            },
        });

        return generateTokens(newUser.id);
    }

    async login(data: z.infer<typeof loginSchema>) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user || !user.passwordHash) {
            throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        return generateTokens(user.id);
    }

    async googleLogin(tokenId: string) {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: config.google.clientId,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            throw new Error('Invalid Google token');
        }

        let user = await prisma.user.findUnique({ where: { email: payload.email } });

        if (!user) {
            // Create new user from Google profile
            // Note: We need a unique username. Using part of email + random suffix as fallback
            const baseUsername = payload.email.split('@')[0];
            const username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;

            user = await prisma.user.create({
                data: {
                    username,
                    email: payload.email,
                    passwordHash: 'GOOGLE_AUTH_NO_PASSWORD',
                    status: 'Verified', // Assuming Google verified emails are verified
                },
            });
        }

        return generateTokens(user.id);
    }
}

export const authService = new AuthService();
