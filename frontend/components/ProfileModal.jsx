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
                    <DialogTitle className="text-2xl font-bold text-foreground">Edit Profile</DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm border border-destructive/20">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-primary/10 text-primary p-3 rounded-lg text-sm border border-primary/20">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    {/* Username */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                {...register('username')}
                                className="w-full bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground/50"
                                placeholder="Username"
                            />
                        </div>
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    {/* Email (Read-only) */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Email Address (Managed)</label>
                        <div className="relative opacity-60">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                value={user?.email || ''}
                                readOnly
                                className="w-full bg-muted/50 border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none cursor-not-allowed text-foreground"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Gender Preference</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <select
                                {...register('gender')}
                                className="w-full bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none text-foreground"
                            >
                                <option value="Male" className="bg-background">Male</option>
                                <option value="Female" className="bg-background">Female</option>
                                <option value="Non-binary" className="bg-background">Non-binary</option>
                                <option value="Prefer not to say" className="bg-background">Prefer not to say</option>
                            </select>
                        </div>
                    </div>

                    {/* Age Range */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Age Range</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                {...register('ageRange')}
                                className="w-full bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground/50"
                                placeholder="e.g. 25-30"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Location / Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                {...register('address')}
                                className="w-full bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground/50"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
