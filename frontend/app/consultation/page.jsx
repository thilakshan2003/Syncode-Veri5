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
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">

                {/* Hero Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 mb-6">
                        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">SLMC Certified Specialists</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                        Expert & Private <span className="text-emerald-600 dark:text-emerald-500">Consultations</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        Book a consultation at a clinic or online channeling with certified specialists. 
                        <br className="hidden sm:block" />
                        Your privacy and health are our top priority.
                    </p>
                </div>

                <PrivacyBanner />

                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Filter by clinic</label>
                        <select
                            className="h-10 rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 px-5 text-sm font-semibold text-slate-700 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 backdrop-blur"
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
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Filter By Role</label>
                        <select
                            className="h-10 rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 px-5 text-sm font-semibold text-slate-700 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 backdrop-blur"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            {specializations.map((role, idx) => (
                                <option key={idx} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Availability</label>
                        <select
                            className="h-10 rounded-full border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 px-5 text-sm font-semibold text-slate-700 dark:text-slate-100 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 backdrop-blur"
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

                {/* Specialists Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specialists.map((specialist) => (
                        <SpecialistCard key={specialist.id} {...specialist} />
                    ))}
                </div>

                {/* Empty State */}
                {specialists.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No specialists found</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Try adjusting your filters to see more results
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
