"use client";

import { use, useState } from 'react';
import Navbar from '@/components/Navbar';
import BookingCalendar from '@/components/BookingCalendar';
import BookingSummary from '@/components/BookingSummary';
import { Button } from '@/components/ui/button'; // Assuming we keep using UI button elsewhere if needed
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data lookup (in real app, fetch by ID)
const getDoctorById = (id) => {
    // Return mock data regardless of ID for prototype
    return {
        id: id,
        name: "Dr. Ajay Rasiah",
        role: "Venereologist",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80", // Placeholder
        cost: "3,600"
    };
};

export default function BookingPage(props) {
    // Unwrap params using React.use()
    const params = use(props.params);
    const [selectedDate, setSelectedDate] = useState("Jan 5, 2026");
    const [selectedTime, setSelectedTime] = useState(null);
    const [mode, setMode] = useState("Online"); // Online, Physical

    const doctor = getDoctorById(params.id);

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
                            />
                        </div>

                        {/* Right Column: Summary Sidebar */}
                        <div>
                            <BookingSummary
                                doctor={doctor}
                                selectedDate={selectedDate}
                                selectedTime={selectedTime ? `${selectedTime} (IST)` : null}
                                cost={doctor.cost}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}
