"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import ClinicSearch from '@/components/ClinicSearch';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Loader2, Navigation } from 'lucide-react';
import { clinicApi } from '@/lib/api';

// Dynamically import ClinicMap to avoid SSR issues with Leaflet
const ClinicMap = dynamic(() => import('@/components/ClinicMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-3xl min-h-[500px]">
            <Loader2 className="w-8 h-8 animate-spin text-veri5-teal" />
        </div>
    )
});

export default function ClinicsPage() {
    const router = useRouter();
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClinic, setSelectedClinic] = useState(null);

    useEffect(() => {
        fetchClinics();
    }, []);

    const fetchClinics = async (search = '') => {
        try {
            setLoading(true);
            setError(null);
            const data = await clinicApi.getClinics(search);
            setClinics(data);
        } catch (err) {
            console.error('Error fetching clinics:', err);
            setError('Failed to load clinics. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchClinics(query);
    };

    // Helper to get clinic hours display text
    const getClinicHours = (availableTime) => {
        if (!availableTime) return 'Hours not available';
        return availableTime;
    };

    // Open Google Maps for directions
    const openGoogleMapsDirections = (clinic) => {
        if (clinic.lat && clinic.lng) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`;
            window.open(url, '_blank');
        } else {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinic.address)}`;
            window.open(url, '_blank');
        }
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="mb-12">
                    <ClinicSearch onSearch={handleSearch} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: List functionality/Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        <div className="bg-card dark:bg-card/50 border border-border dark:border-white/5 p-4 rounded-xl flex items-center justify-between mb-6">
                            <div className="flex items-center text-sm font-medium text-foreground">
                                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                <span className="dark:text-emerald-400">Wellawatte, Colombo</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-veri5-teal hover:bg-veri5-teal/10">Change</Button>
                        </div>

                        <div className="space-y-4 h-[calc(100vh-400px)] overflow-y-auto pr-2">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-veri5-teal" />
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-6 rounded-2xl text-center">
                                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20"
                                        onClick={() => fetchClinics(searchQuery)}
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            ) : clinics.length === 0 ? (
                                <div className="bg-card dark:bg-card/40 border border-border dark:border-white/5 p-8 rounded-2xl text-center">
                                    <p className="text-muted-foreground">No clinics found matching your search.</p>
                                    <Button
                                        variant="link"
                                        className="mt-2 text-veri5-teal"
                                        onClick={() => handleSearch('')}
                                    >
                                        Clear search
                                    </Button>
                                </div>
                            ) : (
                                clinics.map((clinic) => {
                                    const hours = getClinicHours(clinic.availableTime);
                                    return (
                                        <div
                                            key={clinic.id}
                                            className={`bg-card dark:bg-card/40 border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer ${selectedClinic?.id === clinic.id ? 'ring-2 ring-veri5-teal border-transparent' : 'border-border dark:border-white/5 hover:border-veri5-teal/50'}`}
                                            onClick={() => setSelectedClinic(clinic)}
                                        >
                                            <h3 className="font-bold text-foreground mb-1 group-hover:text-veri5-teal transition-colors">{clinic.name}</h3>
                                            <div className="flex items-start text-xs text-muted-foreground mb-2">
                                                <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                                <span>{clinic.address}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground mb-4 space-x-3">
                                                <span className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    <span className="text-muted-foreground">{hours}</span>
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs h-9 px-4 rounded-full border-border dark:border-white/10 hover:bg-muted"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openGoogleMapsDirections(clinic);
                                                    }}
                                                >
                                                    <Navigation className="w-3.5 h-3.5 mr-1.5" />
                                                    Directions
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    className="bg-veri5-teal hover:bg-veri5-teal/90 text-white font-semibold rounded-full h-9 px-5 text-xs shadow-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/consultation?clinicId=${clinic.id}`);
                                                    }}
                                                >
                                                    Book Now
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right: Interactive Map */}
                    <div className="w-full lg:w-2/3 min-h-[500px] lg:h-[calc(100vh-250px)] bg-card border border-border dark:border-white/5 rounded-3xl relative overflow-hidden shadow-inner">
                        <ClinicMap
                            clinics={clinics}
                            selectedClinic={selectedClinic}
                            onSelectClinic={setSelectedClinic}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
