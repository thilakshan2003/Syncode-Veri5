import { z } from 'zod';

export const signupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    // Optional profile fields
    gender: z.string().optional(),
    ageRange: z.string().optional(),
    address: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const googleLoginSchema = z.object({
    tokenId: z.string().min(1, 'Token ID is required'),
});
