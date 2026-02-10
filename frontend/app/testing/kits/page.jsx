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
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
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

            <div className="container mx-auto px-4 md:px-6 py-8">

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-3xl font-bold text-foreground mb-3">Available Test Kits</h1>
                    <p className="text-muted-foreground text-base">Select the screening that meets your needs.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-veri5-teal" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-6 rounded-2xl text-center max-w-md mx-auto mb-24">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                        <Button 
                            variant="ghost" 
                            className="mt-4 text-red-600 dark:text-red-400"
                            onClick={fetchTestKits}
                        >
                            Try Again
                        </Button>
                    </div>
                ) : testKits.length === 0 ? (
                    <div className="bg-card border border-border p-6 rounded-2xl text-center max-w-md mx-auto mb-24">
                        <p className="text-muted-foreground">No test kits available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 mb-16 max-w-6xl mx-auto w-full justify-items-center place-content-center">
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

                <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center border border-border shadow-lg shadow-teal-500/10 overflow-hidden max-w-3xl mx-auto">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-48 h-48 bg-veri5-teal/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-veri5-teal/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Submit your Results</h2>
                        <p className="text-muted-foreground text-xs md:text-sm mb-5 leading-relaxed max-w-xl mx-auto">
                            Take a clear image of the test kit with the QR code and submit it.<br />
                            We will verify your result and update your status. No test result is stored on our server.
                        </p>

                        <Button
                            onClick={() => setModalOpen(true)}
                            className="bg-veri5-teal hover:bg-teal-600 text-white font-semibold rounded-lg px-6 h-11 text-sm shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 active:scale-[0.98] transition-all duration-200 group"
                        >
                            <span>Submit Now</span>
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>

            <ResultUploadModal open={modalOpen} onOpenChange={setModalOpen} />
            <OrderModal open={orderModalOpen} onOpenChange={setOrderModalOpen} testKit={selectedKit} />
        </main>
    );
}
