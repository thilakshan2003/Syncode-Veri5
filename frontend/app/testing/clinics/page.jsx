"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ClinicSearch from '@/components/ClinicSearch';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import api from '@/lib/api';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1); // Return distance with 1 decimal place
};

export default function ClinicsPage() {
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Continue without user location
                }
            );
        }
    }, []);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                setLoading(true);
                const response = await api.get('/clinics');
                // Transform clinic data to match our display format
                const transformedClinics = response.data.map(clinic => {
                    let distance = "TBD";
                    // Calculate distance if we have user location and clinic coordinates
                    if (userLocation && clinic.lat && clinic.lng) {
                        const distanceKm = calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            parseFloat(clinic.lat),
                            parseFloat(clinic.lng)
                        );
                        distance = `${distanceKm} km`;
                    }
                    
                    return {
                        id: clinic.id,
                        name: clinic.name,
                        address: clinic.address,
                        availableTime: clinic.availableTime,
                        distance: distance,
                        status: clinic.isOpen ? "Open Now" : "Closed",
                        tags: clinic.isOpen ? ["Open Now"] : ["Closed"],
                        action: "Book Now",
                        isOpen: clinic.isOpen,
                        lat: clinic.lat,
                        lng: clinic.lng
                    };
                });
                setClinics(transformedClinics);
                setError(null);
            } catch (err) {
                console.error('Error fetching clinics:', err);
                setError('Failed to load clinics');
                setClinics([]);
            } finally {
                setLoading(false);
            }
        };

        fetchClinics();
    }, [userLocation]); // Re-fetch when user location is available

    return (
        <main className="min-h-screen bg-white pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">

                <div className="mb-12">
                    <ClinicSearch onToggleView={setViewMode} viewMode={viewMode} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: List functionality/Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        <div className="bg-white border boundary-slate-200 p-4 rounded-xl flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm font-medium text-slate-700">
                                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                Wellawatte, Colombo
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-veri5-teal">Change</Button>
                        </div>

                        {loading ? (
                            <div className="text-center py-8 text-slate-500">Loading clinics...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500">{error}</div>
                        ) : clinics.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">No clinics found</div>
                        ) : (
                            clinics.map((clinic) => (
                                <div key={clinic.id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-veri5-teal transition-colors">{clinic.name}</h3>
                                    <div className="flex items-center text-xs text-slate-500 mb-2">
                                        <span>{clinic.address}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 mb-4 space-x-3">
                                        <span>{clinic.distance} away</span>
                                        <span>&bull;</span>
                                        <span className={clinic.isOpen ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold'}>
                                            {clinic.status}
                                        </span>
                                        {clinic.availableTime && (
                                            <>
                                                <span>&bull;</span>
                                                <span className="text-slate-400">{clinic.availableTime}</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex gap-2">
                                            {clinic.tags.map((tag, tIdx) => (
                                                <span key={tIdx} className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                                                    clinic.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Button variant="ghost" className="text-veri5-teal font-bold hover:bg-cyan-50 h-8 px-4 text-xs">{clinic.action}</Button>
                                    </div>
                                </div>
                            ))
                        )}
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
