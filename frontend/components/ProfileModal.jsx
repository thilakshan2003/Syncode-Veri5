'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from './ui/dialog';
import { User, Mail, Calendar, MapPin, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const profileSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    gender: z.enum(['Male', 'Female', 'Non-binary', 'Prefer not to say']),
    ageRange: z.string().optional(),
    address: z.string().optional(),
});

export default function ProfileModal({ user, children }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { updateUser } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user?.username || '',
            gender: user?.gender || 'Prefer not to say',
            ageRange: user?.ageRange || '',
            address: user?.address || '',
        },
    });

    const onSubmit = async (data) => {
        try {
            setError('');
            setSuccess('');
            const res = await api.patch('/api/users/profile', data);
            updateUser(res.data.user);
            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                setOpen(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-veri5-navy">Edit Profile</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm border border-emerald-100">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    {/* Username */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                {...register('username')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                placeholder="Username"
                            />
                        </div>
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email Address (Managed)</label>
                        <div className="relative opacity-60">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={user?.email || ''}
                                readOnly
                                className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Gender Preference</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                {...register('gender')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all appearance-none"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    {/* Age Range */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Age Range</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                {...register('ageRange')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                placeholder="e.g. 25-30"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Location / Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                {...register('address')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-veri5-teal hover:bg-veri5-teal/90 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
