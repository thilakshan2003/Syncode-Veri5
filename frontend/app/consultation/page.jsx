"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SpecialistCard from '@/components/SpecialistCard';
import PrivacyBanner from '@/components/PrivacyBanner';
import { Button } from '@/components/ui/button';
import { clinicApi, practitionerApi } from '@/lib/api';

export default function ConsultationPage() {
    const searchParams = useSearchParams();
    const clinicId = searchParams.get('clinicId') ?? '';
    const [filter, setFilter] = useState('all'); // all, specialist, venereologist
    const [practitioners, setPractitioners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clinics, setClinics] = useState([]);
    const [selectedClinicId, setSelectedClinicId] = useState(clinicId);

    useEffect(() => {
        let isMounted = true;

        const fetchClinics = async () => {
            try {
                const data = await clinicApi.getClinics();
                if (isMounted) {
                    setClinics(data || []);
                }
            } catch (err) {
                if (isMounted) {
                    setClinics([]);
                }
            }
        };

        fetchClinics();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        setSelectedClinicId(clinicId);
    }, [clinicId, setSelectedClinicId]);

    useEffect(() => {
        let isMounted = true;

        const fetchPractitioners = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = selectedClinicId
                    ? await clinicApi.getClinicPractitioners(selectedClinicId)
                    : await practitionerApi.getPractitioners();

                if (isMounted) {
                    setPractitioners(data || []);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load practitioners.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPractitioners();

        return () => {
            isMounted = false;
        };
    }, [selectedClinicId]);

    const mappedPractitioners = useMemo(() => {
        return practitioners.map((practitioner) => {
            const role = practitioner.specialization || 'Practitioner';
            const type = role.toLowerCase().includes('venereologist') ? 'venereologist' : 'specialist';
            return {
                id: practitioner.id,
                name: practitioner.name,
                role,
                experience: practitioner.regNo ? `Reg No: ${practitioner.regNo}` : 'Experienced practitioner',
                rating: '4.8 Rating',
                verifiedLints: ['Clinic consultations available'],
                image: '',
                type
            };
        });
    }, [practitioners]);

    const filteredSpecialists = filter === 'all'
        ? mappedPractitioners
        : mappedPractitioners.filter((s) => s.type === filter);

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

                {loading && (
                    <div className="text-center text-slate-500 py-12">Loading practitioners...</div>
                )}

                {!loading && error && (
                    <div className="text-center text-red-500 py-12">{error}</div>
                )}

                {!loading && !error && filteredSpecialists.length === 0 && (
                    <div className="text-center text-slate-500 py-12">
                        No practitioners found.
                    </div>
                )}

                {!loading && !error && filteredSpecialists.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSpecialists.map((specialist) => (
                            <SpecialistCard key={specialist.id} {...specialist} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
