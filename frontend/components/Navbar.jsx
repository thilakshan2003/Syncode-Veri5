"use client";

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import ProfileModal from './ProfileModal';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navLinks = [
        { name: 'Health Dashboard', href: '/dashboard' },
        { name: 'Testing', href: '/testing' },
        { name: 'Consultation', href: '/consultation' },
        { name: 'Resources', href: '/resources' },
    ];

    return (
        <nav className="w-full bg-background/90 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-border dark:border-white/5 sticky top-0 z-50 py-6 shadow-sm">
            <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative">
                        <ShieldCheck className="h-8 w-8 text-emerald-500 dark:text-emerald-400 fill-transparent" strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-bold text-foreground tracking-tight">Veri5</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground hover:text-emerald-400 dark:hover:text-emerald-400 dark:hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all duration-300"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Action */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <ProfileModal user={user}>
                                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
                                        {user?.username ? (
                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </span>
                                        ) : (
                                            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        )}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-foreground">
                                        {user?.username || 'Profile'}
                                    </span>
                                </button>
                            </ProfileModal>
                            <button
                                onClick={logout}
                                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
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
