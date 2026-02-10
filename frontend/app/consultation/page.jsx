"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SpecialistCard from '@/components/SpecialistCard';
import PrivacyBanner from '@/components/PrivacyBanner';
import { Button } from '@/components/ui/button';



export default function ConsultationPage() {
    const searchParams = useSearchParams();
    const clinicId = searchParams.get('clinicId') ?? '';
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
        ? mappedPractitioners
        : mappedPractitioners.filter((s) => s.type === filter);

    if (loading) {
        return <div className="text-center py-20">Loading specialists...</div>;
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">

                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl font-extrabold text-foreground dark:text-emerald-500 mb-4">Expert & Private Consultations</h1>
                    <p className="text-muted-foreground text-lg">
                        Book a consultation at a clinic or online channeling with certified specialists.
                    </p>
                </div>

                <PrivacyBanner />

                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-slate-700">Filter by clinic</label>
                        <select
                            className="h-10 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                            value={selectedClinicId}
                            onChange={(event) => setSelectedClinicId(event.target.value)}
                        >
                            <option value="">All clinics</option>
                            {clinics.map((clinic) => (
                                <option key={clinic.id} value={clinic.id}>
                                    {clinic.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-full border-border text-muted-foreground h-10 px-6 font-bold hover:bg-accent hover:text-foreground"
                    // Placeholder filter logic
                    >
                        Filter By Role
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-full border-primary/50 text-primary bg-primary/10 h-10 px-6 font-bold hover:bg-primary/20"
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
