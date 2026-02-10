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
    // Generate JWT access and refresh tokens
    // Access token is short-lived and used for authentication
    // Refresh token is long-lived and used to obtain new access tokens
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
        // check if user already exists
        const existingUser = await prisma.users.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // check if username is taken
        const existingUsername = await prisma.users.findUnique({ where: { username: data.username } });
        if (existingUsername) {
            throw new Error('Username already taken');
        }
        // generate password hash
        const passwordHash = await bcrypt.hash(data.password, 10);

        // create new user
        const newUser = await prisma.users.create({
            data: {
                username: data.username,
                email: data.email,
                passwordHash,
                status: 'Not_Verified',
                gender: data.gender ?? null,
                ageRange: data.ageRange ?? null,
                address: data.address ?? null,
            },
        });
        // generate jwt tokens
        // the tokens will be used for authentication and they store the user id in their payload
        return generateTokens(newUser.id);
    }

    async login(data: z.infer<typeof loginSchema>) {
        const user = await prisma.users.findUnique({ where: { email: data.email } });
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
        try {
            console.log('🔵 [AuthService] Starting Google login verification');
            console.log('🔵 [AuthService] Client ID:', config.google.clientId);

            // Verify the token with Google
            // If valid, get user info from payload
            const ticket = await client.verifyIdToken({
                idToken: tokenId,
                audience: config.google.clientId,
            });

            console.log('✅ [AuthService] Token verified successfully');
            const payload = ticket.getPayload();

            if (!payload || !payload.email) {
                console.log('❌ [AuthService] Invalid payload - no email found');
                throw new Error('Invalid Google token');
            }

            console.log('🔵 [AuthService] User email from Google:', payload.email);

            // Check if user exists in our database
            let user = await prisma.users.findUnique({ where: { email: payload.email } });

            if (!user) {
                console.log('🔵 [AuthService] User not found, creating new user');
                // Create new user from Google profile
                // Note: We need a unique username. Using part of email + random suffix as fallback
                const baseUsername = payload.email.split('@')[0];
                const username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;

                user = await prisma.users.create({
                    data: {
                        username,
                        email: payload.email,
                        passwordHash: 'GOOGLE_AUTH_NO_PASSWORD', // Placeholder password
                        status: 'Not_Verified', // Cuz the default user status is unverified
                    },
                });
                console.log('✅ [AuthService] New user created:', user.email);
            } else {
                console.log('✅ [AuthService] Existing user found:', user.email);
            }

            console.log('🔵 [AuthService] Generating tokens');
            return generateTokens(user.id);
        } catch (error: any) {
            console.error('❌ [AuthService] Google login failed:', error.message);
            throw error;
        }
    }
}

export const authService = new AuthService();
