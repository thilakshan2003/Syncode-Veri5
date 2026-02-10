'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const publicPaths = ['/login', '/signup', '/', '/staff/login'];

export default function AuthGate({ children }) {
    const { loading } = useAuth();
    const pathname = usePathname();
    const isPublicPath = publicPaths.includes(pathname);

    if (loading && !isPublicPath) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-veri5-teal animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Securing session...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
