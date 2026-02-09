"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SpecialistCard from '@/components/SpecialistCard';
import PrivacyBanner from '@/components/PrivacyBanner';
import { Button } from '@/components/ui/button';



export default function ConsultationPage() {
    const [filter, setFilter] = useState('all'); // all, specialist, venereologist
    const [specialists, setSpecialists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSpecialists = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/practitioners');
                const data = await response.json();
                console.log("Fetched practitioners:", data); // Debug log

                // Map backend data to frontend format
                const mappedData = data.map(p => ({
                    id: p.id,
                    name: p.name,
                    role: p.specialization,
                    experience: `${p.experience} years exp`,
                    rating: `${p.rating} Rating`,
                    verifiedLints: p.availabilityTags || [],
                    image: p.imageUrl || "",
                    type: p.specialization.toLowerCase().includes('venereologist') ? 'venereologist' : 'specialist'
                }));

                setSpecialists(mappedData);
            } catch (error) {
                console.error("Failed to fetch specialists:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialists();
    }, []);

    const filteredSpecialists = filter === 'all'
        ? specialists
        : specialists.filter(s => s.type === filter);

    if (loading) {
        return <div className="text-center py-20">Loading specialists...</div>;
    }

    return (
        <main className="min-h-screen bg-white pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl font-extrabold text-veri5-navy mb-4">Expert & Private Consultations</h1>
                    <p className="text-slate-500 text-lg">
                        Book a consultation at a clinic or online channeling with certified specialists.
                    </p>
                </div>

                <PrivacyBanner />

                <div className="flex justify-end gap-4 mb-8">
                    <Button
                        variant="outline"
                        className="rounded-full border-slate-200 text-slate-700 h-10 px-6 font-bold"
                    // Placeholder filter logic
                    >
                        Filter By Role
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-full border-emerald-500 text-emerald-600 bg-emerald-50 h-10 px-6 font-bold hover:bg-emerald-100"
                    >
                        Filter by Availability
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSpecialists.map((specialist) => (
                        <SpecialistCard key={specialist.id} {...specialist} />
                    ))}
                </div>
            </div>
        </main>
    );
}
