"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SpecialistCard from '@/components/SpecialistCard';
import PrivacyBanner from '@/components/PrivacyBanner';
import { Button } from '@/components/ui/button';



export default function ConsultationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConsultationContent />
        </Suspense>
    );
}

function ConsultationContent() {
    const searchParams = useSearchParams();
    const clinicId = searchParams.get('clinicId') ?? '';
    const [selectedClinicId, setSelectedClinicId] = useState(clinicId);
    const [clinics, setClinics] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [filterRole, setFilterRole] = useState('all');
    const [filterAvailability, setFilterAvailability] = useState('all');
    const [specialists, setSpecialists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [clinicsRes, specsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clinics`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/practitioners/specializations`)
                ]);
                const clinicsData = await clinicsRes.json();
                const specsData = await specsRes.json();
                setClinics(clinicsData);
                setSpecializations(specsData);
            } catch (err) {
                console.error("Failed to fetch filters", err);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchSpecialists = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedClinicId) params.append('clinicId', selectedClinicId);
                if (filterRole !== 'all') params.append('role', filterRole);
                if (filterAvailability !== 'all') params.append('availability', filterAvailability);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/practitioners?${params.toString()}`);
                const data = await response.json();
                console.log("Fetched practitioners:", data);

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
    }, [selectedClinicId, filterRole, filterAvailability]);


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
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-slate-700">Filter By Role</label>
                        <select
                            className="h-10 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            {specializations.map((role, idx) => (
                                <option key={idx} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-slate-700">Availability</label>
                        <select
                            className="h-10 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                            value={filterAvailability}
                            onChange={(e) => setFilterAvailability(e.target.value)}
                        >
                            <option value="all">Any Availability</option>
                            <option value="weekdays">Weekdays</option>
                            <option value="weekends">Weekends</option>
                            <option value="online">Online Only</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {specialists.map((specialist) => (
                        <SpecialistCard key={specialist.id} {...specialist} />
                    ))}
                </div>
            </div>
        </main>
    );
}
