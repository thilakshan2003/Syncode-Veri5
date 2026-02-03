"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import QuickActionCard from '@/components/QuickActionCard';
import StatSummaryCard from '@/components/StatSummaryCard';
import ShareStatusModal from '@/components/ShareStatusModal';
import ResultUploadModal from '@/components/ResultUploadModal';
import ActivityLog from '@/components/ActivityLog';
import { Share2, FileUp, ClipboardList, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    return (
        <main className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-10">

                {/* Status Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-veri5-navy mb-6">Health Dashboard</h1>

                    <div className="bg-veri5-navy rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-navy-900/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                        <div className="flex items-center gap-6 z-10">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/20 animate-pulse-slow">
                                <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl md:text-3xl font-bold">Status: Verified</h2>
                                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded border border-emerald-500/30 uppercase tracking-widest">Active</span>
                                </div>
                                <p className="text-slate-300 text-sm">Last Verified: Jan 15, 2026 &bull; Expires in 28 Days</p>
                            </div>
                        </div>

                        <div className="z-10 w-full md:w-auto">
                            <button
                                onClick={() => setShareModalOpen(true)}
                                className="w-full md:w-auto bg-white text-veri5-navy hover:bg-slate-100 font-bold px-8 py-3.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Share2 className="w-4 h-4" /> Share My Status
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-10">
                    {/* Left Column: Stats & Quick Actions */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatSummaryCard
                                label="Tests Taken"
                                value="4"
                                subtext="Last: Jan 15"
                            />
                            <StatSummaryCard
                                label="Next Encrypt"
                                value="Feb 12"
                                subtext="Auto-scheduled"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div onClick={() => setUploadModalOpen(true)} className="cursor-pointer">
                                    <QuickActionCard
                                        icon={FileUp}
                                        title="Upload Results"
                                        description="Securely upload test results from a partner lab or home kit."
                                        actionText="Upload"
                                        href="#"
                                        color="teal"
                                    />
                                </div>

                                <QuickActionCard
                                    icon={ClipboardList}
                                    title="Order Test Kit"
                                    description="Get a discreet home test kit delivered to your door."
                                    actionText="Browse Kits"
                                    href="/testing/kits"
                                    color="blue"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity Log */}
                    <div className="h-full">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
                                <Button variant="link" asChild className="text-veri5-teal font-bold p-0 h-auto hover:no-underline">
                                    <Link href="/dashboard/activity">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
                                </Button>
                            </div>
                            <div className="flex-grow">
                                <ActivityLog limit={5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ShareStatusModal open={shareModalOpen} onOpenChange={setShareModalOpen} />
            <ResultUploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
        </main>
    );
}