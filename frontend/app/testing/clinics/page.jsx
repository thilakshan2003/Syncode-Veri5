"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ClinicSearch from '@/components/ClinicSearch';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';

const mockClinics = [
    {
        name: "Sexual Health Clinic - SafeZone",
        distance: "2.4 kilometers",
        status: "Open until 6 PM",
        tags: ["Accepts Veri5 ID"],
        action: "Book Now"
    },
    {
        name: "Colombo South Teaching Hospital",
        distance: "2.8 kilometers",
        status: "Open 24/7",
        tags: ["Walk-ins Welcome"],
        action: "Book Now"
    },
    {
        name: "Sexual Health Clinic, Kalubowila",
        distance: "3.1 kilometers",
        status: "Closed",
        tags: ["Available Tomorrow"],
        action: "Book Now"
    }
];

export default function ClinicsPage() {
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">

                <div className="mb-12">
                    <ClinicSearch onToggleView={setViewMode} viewMode={viewMode} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: List functionality/Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm font-medium text-foreground">
                                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                Wellawatte, Colombo
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-primary">Change</Button>
                        </div>

                        {mockClinics.map((clinic, idx) => (
                            <div key={idx} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{clinic.name}</h3>
                                <div className="flex items-center text-xs text-muted-foreground mb-4 space-x-3">
                                    <span>{clinic.distance} away</span>
                                    <span>&bull;</span>
                                    <span className={clinic.status.includes('Closed') ? 'text-destructive' : 'text-emerald-500'}>{clinic.status}</span>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-2">
                                        {clinic.tags.map((tag, tIdx) => (
                                            <span key={tIdx} className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 h-8 px-4 text-xs">{clinic.action}</Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Map Placeholder */}
                    <div className="w-full lg:w-2/3 min-h-[500px] bg-muted/50 rounded-3xl relative overflow-hidden flex items-center justify-center border border-border">
                        {/* This would be an interactive map in production */}
                        <div className="absolute inset-0 grayscale opacity-40 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Colombo&zoom=13&size=800x600&sensor=false')] bg-cover bg-center"></div>

                        <div className="relative bg-background/90 backdrop-blur-md p-8 rounded-2xl text-center max-w-sm border border-border shadow-xl">
                            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Interactive Map Area</h3>
                            <p className="text-muted-foreground text-sm">
                                This area is reserved for the Maps API integration to show real-time clinic locations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
