import type { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { config } from '../config/env.js';

const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15m
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { accessToken, refreshToken } = await authService.signup(req.body);
        setCookies(res, accessToken, refreshToken);
        res.status(201).json({ message: 'Signup successful' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { accessToken, refreshToken, user } = await authService.login(req.body);
        setCookies(res, accessToken, refreshToken);
        res.status(200).json({ message: 'Login successful', user });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

export const googleCallback = async (req: Request, res: Response) => {
    try {
        console.log('🔵 Google callback received');
        console.log('Request body:', req.body);

        const { tokenId } = req.body;

        if (!tokenId) {
            console.log('❌ No tokenId provided');
            return res.status(400).json({ error: 'Token ID is required' });
        }

        console.log('🔵 Token ID received, length:', tokenId.length);
        console.log('🔵 Calling authService.googleLogin...');

        const { accessToken, refreshToken } = await authService.googleLogin(tokenId);

        console.log('✅ Google login successful, setting cookies');
        setCookies(res, accessToken, refreshToken);
        res.status(200).json({ message: 'Google login successful' });
    } catch (error: any) {
        console.error('❌ Google login error:', error.message);
        console.error('Error stack:', error.stack);
        res.status(401).json({ error: error.message || 'Google authentication failed' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successful' });
};

export const me = (req: Request, res: Response) => {
    // @ts-ignore - user attached by authMiddleware
    res.status(200).json({ user: req.user });
};
