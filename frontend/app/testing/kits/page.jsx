"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import TestKitCard from '@/components/TestKitCard';
import ResultUploadModal from '@/components/ResultUploadModal';
import OrderModal from '@/components/OrderModal';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { testKitApi } from '@/lib/api';

export default function TestKitsPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedKit, setSelectedKit] = useState(null);
    const [testKits, setTestKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder images for test kits
    const placeholderImages = [
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    ];

    useEffect(() => {
        fetchTestKits();
    }, []);

    const fetchTestKits = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await testKitApi.getTestKits();
            setTestKits(data);
        } catch (err) {
            console.error('Error fetching test kits:', err);
            setError('Failed to load test kits. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOrderClick = (kit, imageSrc) => {
        setSelectedKit({ ...kit, imageSrc });
        setOrderModalOpen(true);
    };

    // Convert price from cents to display format
    const formatPrice = (priceCents) => {
        if (!priceCents || priceCents === 0) return 'Free';
        return (priceCents / 100).toFixed(0);
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">

                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold text-foreground mb-4">Available Test Kits</h1>
                    <p className="text-muted-foreground text-lg">Select the screening that meets your needs.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-veri5-teal" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center max-w-md mx-auto mb-24">
                        <p className="text-red-600">{error}</p>
                        <Button 
                            variant="ghost" 
                            className="mt-4 text-red-600"
                            onClick={fetchTestKits}
                        >
                            Try Again
                        </Button>
                    </div>
                ) : testKits.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center max-w-md mx-auto mb-24">
                        <p className="text-slate-600">No test kits available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {testKits.map((kit, index) => {
                            const imageSrc = placeholderImages[index % placeholderImages.length];
                            
                            return (
                                <TestKitCard
                                    key={kit.id}
                                    title={kit.name}
                                    features={[kit.description || 'STI screening test']}
                                    price={formatPrice(kit.priceCents)}
                                    badge={kit.name === 'Full Panel' ? 'Best Value' : undefined}
                                    imageSrc={imageSrc}
                                    onOrder={() => handleOrderClick(kit, imageSrc)}
                                />
                            );
                        })}
                    </div>
                )}

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
            <OrderModal open={orderModalOpen} onOpenChange={setOrderModalOpen} testKit={selectedKit} />
        </main>
    );
}
