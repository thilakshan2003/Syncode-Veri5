"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import QuickActionCard from '@/components/QuickActionCard';
import StatSummaryCard from '@/components/StatSummaryCard';
import ShareStatusModal from '@/components/ShareStatusModal';
import ResultUploadModal from '@/components/ResultUploadModal';
import ActivityLog from '@/components/ActivityLog';
import StatusWatchCard from '@/components/StatusWatchCard';
import { Share2, FileUp, ClipboardList, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/lib/api';

export default function Dashboard() {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [userStatus, setUserStatus] = useState(null);
    const [testCount, setTestCount] = useState(0);
    const [nextTestDate, setNextTestDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user status, test count, and next test date from database
    useEffect(() => {
        fetchUserStatus();
        fetchTestCount();
        fetchNextTestDate();
    }, []);

    const fetchUserStatus = async () => {
        try {
            setLoading(true);
            const response = await dashboardApi.getUserStatus();
            
            console.log('API Response:', response); // Debug log
            
            if (response.success) {
                // Backend is returning old format with nested data
                // Check both response.status and response.data.status
                const status = response.status || response.data?.status;
                setUserStatus(status);
                console.log('Set userStatus to:', status); // Debug log
            }
        } catch (err) {
            console.error('Error fetching user status:', err);
            setError('Failed to load status');
        } finally {
            setLoading(false);
        }
    };

    // Determine status display
    const getStatusDisplay = () => {
        console.log('Current userStatus:', userStatus); // Debug log
        console.log('Loading:', loading, 'Error:', error); // Debug log
        
        if (loading) return { label: 'Loading...', color: 'bg-gray-500', textColor: 'text-gray-300', badgeText: '...' };
        if (error || !userStatus) return { label: 'Unknown', color: 'bg-gray-500', textColor: 'text-gray-300', badgeText: 'Unknown' };
        
        // Handle both "Verified" and "Not_Verified" from database
        if (userStatus === 'Verified') {
            return {
                label: 'Verified',
                color: 'bg-emerald-500',
                textColor: 'text-emerald-300',
                badgeText: 'Active'
            };
        } else if (userStatus === 'Not_Verified') {
            return {
                label: 'Not Verified',
                color: 'bg-yellow-500',
                textColor: 'text-yellow-300',
                badgeText: 'Inactive'
            };
        } else {
            console.log('Status did not match - got:', userStatus); // Debug log
            return {
                label: 'Unknown',
                color: 'bg-gray-500',
                textColor: 'text-gray-300',
                badgeText: 'Unknown'
            };
        }
    };

    const fetchTestCount = async () => {
        try {
            const response = await dashboardApi.getUserTestCount();
            
            console.log('Test Count API Response:', response); // Debug log
            
            if (response.success) {
                const count = response.testCount || 0;
                setTestCount(count);
                console.log('Set testCount to:', count); // Debug log
            }
        } catch (err) {
            console.error('Error fetching test count:', err);
            // Don't set error, just keep testCount as 0
        }
    };

    const fetchNextTestDate = async () => {
        try {
            const response = await dashboardApi.getNextTestDate();
            
            console.log('Next Test Date API Response:', response); // Debug log
            
            if (response.success && response.nextTestDate) {
                setNextTestDate(new Date(response.nextTestDate));
                console.log('Set nextTestDate to:', response.nextTestDate); // Debug log
            } else {
                // No test history found
                setNextTestDate(null);
                console.log('No test history found'); // Debug log
            }
        } catch (err) {
            console.error('Error fetching next test date:', err);
            // Don't set error, just keep nextTestDate as null
        }
    };

    // Format date for display (e.g., "Feb 12" or "Mar 5")
    const formatDate = (date) => {
        if (!date) return 'Not scheduled';
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

        const statusDisplay = getStatusDisplay();

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
                            <div className={`w-20 h-20 ${statusDisplay.color} rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/20 animate-pulse-slow`}>
                                <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl md:text-3xl font-bold">Status: {statusDisplay.label}</h2>
                                    <span className={`${statusDisplay.color}/20 ${statusDisplay.textColor} text-xs font-bold px-2 py-1 rounded border ${statusDisplay.color}/30 uppercase tracking-widest`}>
                                        {statusDisplay.badgeText}
                                    </span>
                                </div>
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
                                value={loading ? "..." : testCount.toString()}
                                subtext={testCount === 0 ? "No tests yet" : `Total: ${testCount} test${testCount > 1 ? 's' : ''}`}
                            />
                            <StatSummaryCard
                                label="The Next Test Day"
                                value={loading ? "..." : formatDate(nextTestDate)}
                                subtext={nextTestDate ? "Auto-scheduled" : "Schedule first test"}
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

                    {/* Right Column: Activity Log & Status Watch */}
                    <div className="h-full space-y-6">
                        {/* Status Watch Card */}
                        <StatusWatchCard />
                        
                        {/* Activity Log */}
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


