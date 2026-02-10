import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import TrustedBy from '@/components/TrustedBy';
import CTA from '@/components/CTA';

export default function Home() {
    return (
        <main className="min-h-screen bg-background font-sans text-foreground selection:bg-veri5-teal/20 selection:text-foreground transition-colors duration-300">
            <Navbar />
            <Hero />
            <Features />
            <TrustedBy />
            <CTA />

            {/* Simple Footer for completeness */}
            <footer className="w-full py-8 text-center text-muted-foreground text-sm bg-background border-t border-border">
                &copy; 2026 Veri5 Platform. All rights reserved.
            </footer>
        </main>
    );
}
