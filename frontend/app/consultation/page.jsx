"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SpecialistCard from '@/components/SpecialistCard';
import PrivacyBanner from '@/components/PrivacyBanner';
import { Button } from '@/components/ui/button';

const specialists = [
    {
        name: "Dr. Sandamali Jayasinghe",
        role: "Sexual Health Specialist",
        experience: "12 years exp",
        rating: "4.9 Rating",
        verifiedLints: ["Weekdays Online Channeling", "Weekends Clinic consultations"],
        image: "", // Placeholder or use a real image URL
        type: "specialist"
    },
    {
        name: "Dr. Chanidu Wijepala",
        role: "Venereologist",
        experience: "6 years exp",
        rating: "4.6 Rating",
        verifiedLints: ["Weekends Online Channeling", "Free consultations at NHS"],
        image: "",
        type: "venereologist"
    },
    {
        name: "Dr. Ajay Rasiah",
        role: "Venereologist",
        experience: "15 years exp",
        rating: "4.8 Rating",
        verifiedLints: ["Daily Online Channeling"],
        image: "",
        type: "venereologist"
    }
];

export default function ConsultationPage() {
    const [filter, setFilter] = useState('all'); // all, specialist, venereologist

    const filteredSpecialists = filter === 'all'
        ? specialists
        : specialists.filter(s => s.type === filter);

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

                <div className="flex justify-end gap-4 mb-8">
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSpecialists.map((specialist, idx) => (
                        <SpecialistCard key={idx} {...specialist} />
                    ))}
                </div>
            </div>
        </main>
    );
}
