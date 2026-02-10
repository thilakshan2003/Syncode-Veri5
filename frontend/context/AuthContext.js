'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext({
    user: null,
    loading: true,
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
    googleLogin: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const fetchMe = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/auth/me');
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    const login = async (credentials) => {
        try {
            // Backend expects 'identifier' (username or email) and 'password'
            const payload = {
                identifier: credentials.email || credentials.username,
                password: credentials.password
            };
            await api.post('/api/auth/login', payload);
            await fetchMe();
            router.push('/dashboard');
        } catch (err) {
            throw err.response?.data?.error || 'Login failed';
        }
    };

    const signup = async (userData) => {
        try {
            await api.post('/api/auth/signup', userData);
            await fetchMe();
            router.push('/dashboard');
        } catch (err) {
            throw err.response?.data?.error || 'Signup failed';
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout');
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const googleLogin = async (tokenId) => {
        try {
            console.log('🔵 [Frontend] Starting Google login');
            console.log('🔵 [Frontend] Token ID length:', tokenId?.length);
            console.log('🔵 [Frontend] API URL:', process.env.NEXT_PUBLIC_API_URL);

            const response = await api.post('/api/auth/google', { tokenId });
            console.log('✅ [Frontend] Google login response:', response.data);

            await fetchMe();
            router.push('/dashboard');
        } catch (err) {
            console.error('❌ [Frontend] Google login error:', err);
            console.error('❌ [Frontend] Error response:', err.response?.data);
            console.error('❌ [Frontend] Error status:', err.response?.status);
            throw err.response?.data?.error || 'Google login failed';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                updateUser,
                googleLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
