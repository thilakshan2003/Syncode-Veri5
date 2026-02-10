"use client";

import { use, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookingCalendar from '@/components/BookingCalendar';
import BookingSummary from '@/components/BookingSummary';
import { Button } from '@/components/ui/button'; // Assuming we keep using UI button elsewhere if needed
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';


export default function BookingPage(props) {
    const params = use(props.params);
    const router = useRouter();
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [mode, setMode] = useState("Online"); // Online, Physical
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder images for healthcare consultants
    const placeholderImages = [
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face",
    ];

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/practitioners/${params.id}`);
                if (!response.ok) throw new Error('Failed to fetch doctor details');
                const data = await response.json();

                // Generate a consistent placeholder image based on practitioner ID
                const placeholderIndex = parseInt(data.id) % placeholderImages.length;

                // Transform data for UI
                setDoctor({
                    id: data.id,
                    name: data.name,
                    role: data.specialization,
                    image: data.imageUrl || placeholderImages[placeholderIndex],
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
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-8">

                <div className="max-w-6xl mx-auto">
                    {/* Back Link */}
                    <Link href="/consultation" className="inline-flex items-center text-muted-foreground hover:text-primary font-medium mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Specialists
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8">

                        {/* Left Column: Calendar & Options */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-extrabold text-foreground">Select Time</h1>

                                {/* Mode Toggle */}
                                <div className="bg-muted p-1 rounded-xl inline-flex">
                                    <button
                                        onClick={() => setMode("Online")}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'Online' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        Online
                                    </button>
                                    <button
                                        onClick={() => setMode("Physical")}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'Physical' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
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
                                onBook={async () => {
                                    if (!user) {
                                        router.push('/login');
                                        return;
                                    }

                                    const slot = doctor.appointmentSlots.find(s => {
                                        const d = new Date(s.startsAt);
                                        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                        const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                        return dateStr === selectedDate && timeStr === selectedTime && s.mode === mode.toLowerCase();
                                    });

                                    if (!slot) {
                                        alert("Selected slot is no longer available.");
                                        return;
                                    }

                                    try {
                                        await api.post('/api/appointments', { slotId: slot.id });
                                        alert("Session Booked Successfully!");
                                        router.push('/dashboard');
                                    } catch (err) {
                                        console.error(err);
                                        alert(err.response?.data?.error || "Booking failed.");
                                    }
                                }}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}
