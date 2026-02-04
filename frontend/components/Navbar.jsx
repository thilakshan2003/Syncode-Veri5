"use client";

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import ProfileModal from './ProfileModal';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navLinks = [
        { name: 'Health Dashboard', href: '/dashboard' },
        { name: 'Testing', href: '/testing' },
        { name: 'Consultation', href: '/consultation' },
        { name: 'Resources', href: '/resources' },
    ];

    return (
        <nav className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 py-6 shadow-sm">
            <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative">
                        <ShieldCheck className="h-8 w-8 text-veri5-teal fill-transparent" strokeWidth={2.5} />
                        {/* Small checkmark simulation if needed, but standard icon is close enough */}
                    </div>
                    <span className="text-2xl font-bold text-veri5-navy tracking-tight">Veri5</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-500 hover:text-veri5-teal transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Action */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <ProfileModal user={user}>
                                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <div className="w-10 h-10 rounded-full bg-veri5-teal/10 border border-veri5-teal/20 flex items-center justify-center overflow-hidden">
                                        {user?.username ? (
                                            <span className="text-veri5-teal font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </span>
                                        ) : (
                                            <ShieldCheck className="h-5 w-5 text-veri5-teal" />
                                        )}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-veri5-navy">
                                        {user?.username || 'Profile'}
                                    </span>
                                </button>
                            </ProfileModal>
                            <button
                                onClick={logout}
                                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-veri5-teal hover:bg-veri5-teal/90 text-white rounded-full px-8 font-semibold">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
