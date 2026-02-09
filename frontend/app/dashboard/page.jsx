"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import QuickActionCard from '@/components/QuickActionCard';
import StatSummaryCard from '@/components/StatSummaryCard';
import ShareStatusModal from '@/components/ShareStatusModal';
import ResultUploadModal from '@/components/ResultUploadModal';
import ActivityLog from '@/components/ActivityLog';
import StatusWatchCard from '@/components/StatusWatchCard';
import { Share2, FileUp, ClipboardList, ShieldCheck, ChevronRight, Menu, X, Calendar, MapPin, Video, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/lib/api';

export default function Dashboard() {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userStatus, setUserStatus] = useState(null);
    const [testCount, setTestCount] = useState(0);
    const [nextTestDate, setNextTestDate] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user status, test count, and next test date from database
    useEffect(() => {
        fetchUserStatus();
        fetchTestCount();
        fetchNextTestDate();
        fetchAppointments();
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

    const fetchAppointments = async () => {
        try {
            const response = await dashboardApi.getUserAppointments();

            console.log('Appointments API Response:', response); // Debug log

            if (response.success) {
                setAppointments(response.data);
                console.log('Set appointments to:', response.data); // Debug log
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
            // Don't set error, just keep appointments as empty array
        }
    };

    // Format date for display (e.g., "Feb 12" or "Mar 5")
    const formatDate = (date) => {
        if (!date) return 'Not scheduled';
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Format appointment date and time
    const formatAppointmentDate = (dateString) => {
        if (!dateString) return 'Not scheduled';
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatAppointmentTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { hour: 'numeric', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-US', options);
    };

    const getAppointmentStatusBadge = (status) => {
        const badges = {
            booked: { label: 'Booked', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
            cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200' },
            no_show: { label: 'No Show', color: 'bg-gray-100 text-gray-700 border-gray-200' }
        };
        return badges[status] || badges.booked;
    };

    const statusDisplay = getStatusDisplay();

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            {/* Floating Toggle Button for Sidebar */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex fixed right-6 top-24 z-50 bg-veri5-navy text-white p-3 rounded-full shadow-lg hover:bg-veri5-navy/90 transition-all items-center justify-center"
                aria-label="Toggle Activity Sidebar"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Main Content with Sidebar Layout */}
            <div className="flex relative">
                {/* Main Content Area */}
                <div className={`flex-1 px-4 md:px-6 py-10 transition-all duration-300 ${sidebarOpen ? 'lg:pr-0' : 'lg:pr-6'}`}>
                    <div className="max-w-6xl mx-auto">
                        {/* Status Header */}
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold text-foreground mb-6">Health Dashboard</h1>

                            <div className="bg-veri5-navy dark:bg-emerald-900/40 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-navy-900/10 border border-white/5 dark:border-emerald-500/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 transition-colors duration-500">
                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-emerald-400/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

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

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
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

                        {/* Appointments Section */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-foreground">Your Appointments</h3>
                                <Button variant="link" asChild className="text-veri5-teal font-bold p-0 h-auto hover:no-underline text-sm">
                                    <Link href="/consultation">Book New <ChevronRight className="w-4 h-4 ml-1" /></Link>
                                </Button>
                            </div>

                            {appointments.length === 0 ? (
                                <div className="bg-card dark:bg-card/40 rounded-2xl p-8 border-2 border-dashed border-border text-center">
                                    <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-muted-foreground font-medium">No appointments scheduled</p>
                                    <Button asChild className="mt-4 bg-veri5-teal hover:bg-veri5-teal/90 text-white rounded-full">
                                        <Link href="/consultation">Book Your First Appointment</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {appointments.slice(0, 3).map((appointment) => {
                                        const statusBadge = getAppointmentStatusBadge(appointment.status);
                                        return (
                                            <div
                                                key={appointment.id}
                                                className="bg-card dark:bg-card/40 rounded-2xl p-5 border border-border dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="text-base font-bold text-foreground">
                                                                Dr. {appointment.practitionerName}
                                                            </h4>
                                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statusBadge.color} dark:bg-white/5`}>
                                                                {statusBadge.label}
                                                            </span>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Calendar className="w-4 h-4 text-muted-foreground/60" />
                                                                <span>{formatAppointmentDate(appointment.appointmentDate)}</span>
                                                                {appointment.appointmentDate && (
                                                                    <>
                                                                        <Clock className="w-4 h-4 text-muted-foreground/60 ml-2" />
                                                                        <span>{formatAppointmentTime(appointment.appointmentDate)}</span>
                                                                    </>
                                                                )}
                                                            </div>

                                                            {appointment.mode === 'online' ? (
                                                                <div className="flex items-center gap-2 text-sm text-veri5-teal">
                                                                    <Video className="w-4 h-4" />
                                                                    <span className="font-medium">Online Consultation</span>
                                                                </div>
                                                            ) : (
                                                                appointment.clinicName && (
                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                        <MapPin className="w-4 h-4 text-muted-foreground/60" />
                                                                        <span>{appointment.clinicName}</span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {appointments.length > 3 && (
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href="/dashboard/appointments">
                                                View All {appointments.length} Appointments
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
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

                        {/* Status Watch Section */}
                        <div className="mb-10">
                            <StatusWatchCard />
                        </div>
                    </div>
                </div>

                {/* Activity Log Sidebar - Hidden by default, slides in from right */}
                <aside
                    className={`hidden lg:block fixed right-0 top-0 h-screen w-96 bg-card dark:bg-[#0F172A] border-l border-border dark:border-white/5 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="h-full overflow-y-auto pt-20">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                                <Button variant="link" asChild className="text-veri5-teal font-bold p-0 h-auto hover:no-underline text-xs">
                                    <Link href="/dashboard/activity">View All <ChevronRight className="w-3 h-3 ml-1" /></Link>
                                </Button>
                            </div>
                            <ActivityLog />
                        </div>
                    </div>
                </aside>

                {/* Overlay when sidebar is open */}
                {sidebarOpen && (
                    <div
                        className="hidden lg:block fixed inset-0 bg-black/20 z-30"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Mobile Activity Log - Show at bottom on mobile */}
                <div className="lg:hidden px-4 md:px-6 pb-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-card dark:bg-card/40 rounded-3xl p-6 border border-border dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                                <Button variant="link" asChild className="text-veri5-teal font-bold p-0 h-auto hover:no-underline">
                                    <Link href="/dashboard/activity">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
                                </Button>
                            </div>
                            <ActivityLog limit={5} />
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