import Navbar from '@/components/Navbar';
import PathSelectionCard from '@/components/PathSelectionCard';
import { Building2, Package } from 'lucide-react';

export default function TestingPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-16">
                {/* Hero Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 mb-6">
                        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Safe & Confidential Testing</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                        Choose Your <span className="text-emerald-600 dark:text-emerald-500">Testing Path</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        Select a local clinic for professional testing or order a kit for total privacy at home. 
                        <br className="hidden sm:block" />
                        Both paths securely sync results to your Veri5 profile.
                    </p>
                </div>

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
