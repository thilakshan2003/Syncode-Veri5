"use client";

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import ClinicSearch from '@/components/ClinicSearch';
import { Button } from '@/components/ui/button';
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

    return (
        <main className="min-h-screen bg-white pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">

                <div className="mb-12">
                    <ClinicSearch
                        onToggleView={setViewMode}
                        viewMode={viewMode}
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: List functionality/Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-4">
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
                                </div>

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
                    <div className="w-full lg:w-2/3 min-h-[500px] bg-slate-100 rounded-3xl relative overflow-hidden flex items-center justify-center border border-slate-200">
                        {/* This would be an interactive map in production */}
                        <div className="absolute inset-0 grayscale opacity-40 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Colombo&zoom=13&size=800x600&sensor=false')] bg-cover bg-center"></div>

                        <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl text-center max-w-sm border border-white shadow-xl">
                            <div className="w-12 h-12 bg-veri5-teal text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Interactive Map Area</h3>
                            <p className="text-slate-500 text-sm">
                                This area is reserved for the Maps API integration to show real-time clinic locations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
