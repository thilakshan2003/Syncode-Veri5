"use client";

import { use, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookingCalendar from '@/components/BookingCalendar';
import BookingSummary from '@/components/BookingSummary';
import { Button } from '@/components/ui/button'; // Assuming we keep using UI button elsewhere if needed
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';


export default function BookingPage(props) {
    const params = use(props.params);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [mode, setMode] = useState("Online"); // Online, Physical
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/practitioners/${params.id}`);
                if (!response.ok) throw new Error('Failed to fetch doctor details');
                const data = await response.json();

                // Transform data for UI
                setDoctor({
                    id: data.id,
                    name: data.name,
                    role: data.specialization,
                    image: data.imageUrl || "",
                    defaultCost: "3,600", // Fallback or derived
                    appointmentSlots: data.appointmentSlots || []
                });
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchDoctor();
        }
    }, [params.id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error || !doctor) return <div className="text-center py-20 text-red-500">Error: {error || 'Doctor not found'}</div>;

    return (
        <main className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-8">

                <div className="max-w-6xl mx-auto">
                    {/* Back Link */}
                    <Link href="/consultation" className="inline-flex items-center text-slate-500 hover:text-veri5-teal font-medium mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Specialists
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* Left Column: Calendar & Options */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-extrabold text-veri5-navy">Select Time</h1>

                                {/* Mode Toggle */}
                                <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                                    <button
                                        onClick={() => setMode("Online")}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'Online' ? 'bg-white text-veri5-teal shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Online
                                    </button>
                                    <button
                                        onClick={() => setMode("Physical")}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'Physical' ? 'bg-white text-veri5-teal shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Physical
                                    </button>
                                </div>
                            </div>

                            <BookingCalendar
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                                selectedTime={selectedTime}
                                onTimeSelect={setSelectedTime}
                                availableSlots={doctor.appointmentSlots}
                                mode={mode}
                            />
                        </div>

                        {/* Right Column: Summary Sidebar */}
                        <div>
                            <BookingSummary
                                doctor={doctor}
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                                mode={mode}
                                cost={selectedTime ? doctor.appointmentSlots.find(s => {
                                    const d = new Date(s.startsAt);
                                    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                    return dateStr === selectedDate && timeStr === selectedTime && s.mode === mode.toLowerCase();
                                })?.priceCents / 100 : "—"}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}
