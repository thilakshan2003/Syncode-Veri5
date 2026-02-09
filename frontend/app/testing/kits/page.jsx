"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import TestKitCard from '@/components/TestKitCard';
import ResultUploadModal from '@/components/ResultUploadModal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const products = [
    {
        title: "Standard Screen",
        features: ["Checks for 7 common infections"],
        price: "2800",
    },
    {
        title: "Full Panel",
        features: ["Complete 4-marker screening"],
        price: "3600",
        badge: "Best Value"
    },
    {
        title: "Express Duo",
        features: ["Basic STD & HIV Duo"],
        price: "1600"
    }
];

export default function TestKitsPage() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-foreground mb-4">Available Test Kits</h1>
                    <p className="text-muted-foreground text-lg">Select the screening that meets your needs.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {products.map((p, idx) => (
                        <TestKitCard
                            key={idx}
                            {...p}
                        />
                    ))}
                </div>

                <div className="bg-gradient-to-r from-[#28a99e] to-[#208a81] rounded-3xl p-12 md:p-16 text-center shadow-2xl shadow-teal-900/20 relative overflow-hidden">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Submit your Results</h2>
                        <p className="text-teal-50 text-lg mb-10 leading-relaxed font-medium">
                            Take a clear image of the test kit with the QR code and submit it.
                            We will verify your result and update your status. No test result is stored on our server.
                        </p>

                        <Button
                            onClick={() => setModalOpen(true)}
                            className="bg-white dark:bg-primary hover:bg-slate-50 dark:hover:bg-primary/90 text-veri5-navy dark:text-white font-bold rounded-full px-10 h-14 text-base shadow-xl active:scale-95 transition-all"
                        >
                            Submit Now <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            <ResultUploadModal open={modalOpen} onOpenChange={setModalOpen} />
        </main>
    );
}
