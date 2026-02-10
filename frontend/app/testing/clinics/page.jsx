"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react';
=======
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
>>>>>>> main
import Navbar from '@/components/Navbar';
import ClinicSearch from '@/components/ClinicSearch';
import ClinicMap from '@/components/ClinicMap';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import api from '@/lib/api';
import { MapPin, Clock } from 'lucide-react';

const dayOrder = [1, 2, 3, 4, 5, 6, 0];
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayIndexByLabel = {
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    thur: 4,
    fri: 5,
    sat: 6,
    sun: 0
};

const toMinutes = (timeText) => {
    const [hours, minutes] = timeText.split(':').map(Number);
    return hours * 60 + minutes;
};

const buildDayRange = (startIndex, endIndex) => {
    const startPos = dayOrder.indexOf(startIndex);
    const endPos = dayOrder.indexOf(endIndex);
    if (startPos === -1 || endPos === -1) return [];
    if (startPos <= endPos) return dayOrder.slice(startPos, endPos + 1);
    return [...dayOrder.slice(startPos), ...dayOrder.slice(0, endPos + 1)];
};

const parseAvailableTime = (value) => {
    if (!value || typeof value !== 'string') {
        return { label: 'Hours not available', isAlwaysOpen: false, days: [], start: null, end: null };
    }

    const trimmed = value.trim();
    if (/^(open\s*)?24\s*\/\s*7$/i.test(trimmed)) {
        return { label: '24/7', isAlwaysOpen: true, days: [], start: null, end: null };
    }

    const match = trimmed.match(
        /^(Weekends|Weekdays|Mon|Tue|Wed|Thu|Thur|Fri|Sat|Sun)(?:\s*-\s*(Mon|Tue|Wed|Thu|Thur|Fri|Sat|Sun))?\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/i
    );

    if (!match) {
        return { label: trimmed, isAlwaysOpen: false, days: [], start: null, end: null };
    }

    const dayToken = match[1];
    const endToken = match[2];
    const start = match[3];
    const end = match[4];

    if (/^weekends$/i.test(dayToken)) {
        return { label: `Weekends ${start}-${end}`, isAlwaysOpen: false, days: [6, 0], start, end };
    }

    if (/^weekdays$/i.test(dayToken)) {
        return { label: `Weekdays ${start}-${end}`, isAlwaysOpen: false, days: [1, 2, 3, 4, 5], start, end };
    }

    const startIndex = dayIndexByLabel[dayToken.toLowerCase()];
    const endIndex = endToken ? dayIndexByLabel[endToken.toLowerCase()] : startIndex;
    const days = buildDayRange(startIndex, endIndex);
    const dayLabel = endToken ? `${dayLabels[startIndex]}-${dayLabels[endIndex]}` : dayLabels[startIndex];

    return { label: `${dayLabel} ${start}-${end}`, isAlwaysOpen: false, days, start, end };
};

const isClinicOpenNow = (availability, now) => {
    if (availability.isAlwaysOpen) return true;
    if (!availability.start || !availability.end || availability.days.length === 0) return false;

    const nowDay = now.getDay();
    if (!availability.days.includes(nowDay)) return false;

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = toMinutes(availability.start);
    const endMinutes = toMinutes(availability.end);

    if (endMinutes < startMinutes) {
        return nowMinutes >= startMinutes || nowMinutes < endMinutes;
    }

    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
};

const haversineKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};

export default function ClinicsPage() {
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let isMounted = true;
        const timer = setTimeout(async () => {
            if (isMounted) {
                setLoading(true);
                setError(null);
            }

            try {
                const response = await api.get('/clinics', {
                    params: searchTerm ? { search: searchTerm } : undefined
                });
                if (isMounted) {
                    setClinics(response.data || []);
                }
            } catch (fetchError) {
                if (isMounted) {
                    setError('Unable to load clinics right now.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            () => {
                setUserLocation(null);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);


    const clinicsWithMeta = useMemo(() => {
        const now = new Date();
        return clinics.map((clinic) => {
            const availability = parseAvailableTime(clinic.availableTime);
            const isOpen = isClinicOpenNow(availability, now);
            const lat = clinic.lat !== null && clinic.lat !== undefined ? Number(clinic.lat) : null;
            const lng = clinic.lng !== null && clinic.lng !== undefined ? Number(clinic.lng) : null;
            const canMeasureDistance = userLocation && Number.isFinite(lat) && Number.isFinite(lng);
            const distanceKm = canMeasureDistance
                ? haversineKm(userLocation.lat, userLocation.lng, lat, lng)
                : null;

            return {
                ...clinic,
                availability,
                isOpen,
                distanceKm
            };
        });
    }, [clinics, userLocation]);
=======
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
>>>>>>> main

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="mb-12">
<<<<<<< HEAD
                    <ClinicSearch
                        onToggleView={setViewMode}
                        viewMode={viewMode}
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
=======
                    <ClinicSearch onSearch={handleSearch} />
>>>>>>> main
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: List functionality/Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-4">
<<<<<<< HEAD
                        {loading && (
                            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-sm text-slate-500">
                                Loading clinics...
                            </div>
                        )}

                        {!loading && error && (
                            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        {!loading && !error && clinicsWithMeta.length === 0 && (
                            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-sm text-slate-500">
                                No clinics available yet.
                            </div>
                        )}

                        {clinicsWithMeta.map((clinic) => (
                            <div key={clinic.id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-veri5-teal transition-colors">{clinic.name}</h3>
                                <p className="text-xs text-slate-500 mb-3">{clinic.address}</p>
                                <div className="flex items-center text-xs text-slate-500 mb-4 space-x-3 flex-wrap">
                                    <span>
                                        {clinic.distanceKm !== null
                                            ? `${clinic.distanceKm.toFixed(1)} km away`
                                            : 'Distance unavailable'}
                                    </span>
                                    <span>&bull;</span>
                                    <span className={clinic.isOpen ? 'text-emerald-600' : 'text-red-500'}>
                                        {clinic.isOpen ? 'Open now' : 'Closed now'}
                                    </span>
                                </div>

                                <div className="flex items-center text-xs text-slate-500 mb-4 space-x-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{clinic.availability.label}</span>
=======
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
>>>>>>> main
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

<<<<<<< HEAD
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-2">
                                        <span className="bg-cyan-50 text-veri5-teal text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                            Accepts Veri5 ID
                                        </span>
                                    </div>
                                    <Button variant="ghost" className="text-veri5-teal font-bold hover:bg-cyan-50 h-8 px-4 text-xs">Book Now</Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Map Placeholder */}
                    <div className="w-full lg:w-2/3 h-[500px] bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200">
                        <ClinicMap clinics={clinicsWithMeta} />
=======
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
>>>>>>> main
                    </div>
                </div>
            </div>
        </main>
    );
}
