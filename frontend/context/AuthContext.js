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
            await api.post('/api/auth/login', credentials);
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
            await api.post('/api/auth/google', { tokenId });
            await fetchMe();
            router.push('/dashboard');
        } catch (err) {
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
