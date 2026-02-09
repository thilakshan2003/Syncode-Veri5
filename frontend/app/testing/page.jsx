import Navbar from '@/components/Navbar';
import PathSelectionCard from '@/components/PathSelectionCard';
import { Building2, Package } from 'lucide-react';

export default function TestingPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground dark:text-emerald-500 mb-4 tracking-tight">
                    Choose how you'd like to get tested.
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
                    Select a local clinic for professional testing or order a kit for total privacy at home. Both paths securely sync results to your Veri5 profile.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <PathSelectionCard
                        title="Partnered Clinics"
                        description="Visit a professional clinic near you. No appointment necessary at many locations. Collection is handled by medical staff."
                        benefits={[
                            "24-48 hour turnaround",
                            "Professional collection",
                            "1,200+ locations nationwide"
                        ]}
                        icon={Building2}
                        buttonText="Find a Clinic"
                        buttonLink="/testing/clinics"
                        badge="Fastest Results"
                    />

                    <PathSelectionCard
                        title="Home Test Kits"
                        description="Order a discrete kit to your door. Complete the test in the comfort of your home and mail it back with a pre-paid label."
                        benefits={[
                            "Discreet unmarked packaging",
                            "Simple self-swab process",
                            "Free overnight shipping"
                        ]}
                        icon={Package}
                        buttonText="Order Home Kit"
                        buttonLink="/testing/kits"
                        badge="Maximum Privacy"
                    />
                </div>
            </div>
        </main>
    );
}
