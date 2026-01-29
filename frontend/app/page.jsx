import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import TrustedBy from '@/components/TrustedBy';
import CTA from '@/components/CTA';

export default function Home() {
    return (
        <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-veri5-teal/20 selection:text-veri5-navy">
            <Navbar />
            <Hero />
            <Features />
            <TrustedBy />
            <CTA />

            {/* Simple Footer for completeness */}
            <footer className="w-full py-8 text-center text-gray-400 text-sm bg-white">
                &copy; 2026 Veri5 Platform. All rights reserved.
            </footer>
        </main>
    );
}
