import Navbar from '@/components/Navbar';
import ActivityLog from '@/components/ActivityLog';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ActivityPage() {
    return (
        <main className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">

                <div className="mb-8">
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-veri5-teal mb-2">
                        <Link href="/dashboard" className="flex items-center text-slate-400 font-medium">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold text-veri5-navy">Activity Log</h1>
                    <p className="text-slate-500 mt-2">View your complete history of tests, shares, and consultations.</p>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                    <ActivityLog />
                </div>
            </div>
        </main>
    );
}