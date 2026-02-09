"use client";

import { useState, useEffect } from 'react';
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
                        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm font-medium text-foreground">
                                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                {/* <div className="bg-white border boundary-slate-200 p-4 rounded-xl flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm font-medium text-slate-700">
                                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                Wellawatte, Colombo
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-veri5-teal">Change</Button>
                        </div> */}

                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-veri5-teal" />
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center">
                                        <p className="text-red-600">{error}</p>
                                        <Button
                                            variant="ghost"
                                            className="mt-4 text-red-600"
                                            onClick={() => fetchClinics(searchQuery)}
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                ) : clinics.length === 0 ? (
                                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center">
                                        <p className="text-slate-600">No clinics found.</p>
                                    </div>
                                ) : (
                                    clinics.map((clinic) => {
                                        const hours = getClinicHours(clinic.availableTime);
                                        return (
                                            <div
                                                key={clinic.id}
                                                className={`bg-white border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer ${selectedClinic?.id === clinic.id ? 'border-veri5-teal border-2' : 'border-slate-100'}`}
                                                onClick={() => setSelectedClinic(clinic)}
                                            >
                                                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-veri5-teal transition-colors">{clinic.name}</h3>
                                                <p className="text-xs text-slate-500 mb-2">{clinic.address}</p>
                                                <div className="flex items-center text-xs text-slate-500 mb-4 space-x-3">
                                                    <span className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        <span className="text-slate-600">{hours}</span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs h-8 px-3"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openGoogleMapsDirections(clinic);
                                                        }}
                                                    >
                                                        <Navigation className="w-3 h-3 mr-1" />
                                                        Directions
                                                    </Button>
                                                    <Button variant="ghost" className="text-veri5-teal font-bold hover:bg-cyan-50 h-8 px-4 text-xs">Book Now</Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Right: Interactive Map */}
                            <div className="w-full lg:w-2/3 min-h-[500px] bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200">
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
