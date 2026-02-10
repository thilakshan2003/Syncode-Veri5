"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import QuickActionCard from '@/components/QuickActionCard';
import StatSummaryCard from '@/components/StatSummaryCard';
import ShareStatusModal from '@/components/ShareStatusModal';
import ResultUploadModal from '@/components/ResultUploadModal';
import ActivityLog from '@/components/ActivityLog';
import StatusWatchCard from '@/components/StatusWatchCard';
import { Share2, FileUp, ClipboardList, ShieldCheck, ChevronRight, Calendar, MapPin, Video, Clock, RefreshCw, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { dashboardApi } from '@/lib/api';

export default function Dashboard() {
    const searchParams = useSearchParams();
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [userStatus, setUserStatus] = useState(null);
    const [testCount, setTestCount] = useState(0);
    const [nextTestDate, setNextTestDate] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check URL parameters for auto-opening modals
    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'share') {
            setShareModalOpen(true);
        }
    }, [searchParams]);

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
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            {/* Main Content */}
            <div className="px-4 md:px-6 py-10">
                <div className="max-w-6xl mx-auto">
                    {/* Status Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-6">Health Dashboard</h1>

                        <div className={`rounded-2xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden ${
                            userStatus === 'Verified'
                                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-800 dark:to-teal-900 border border-emerald-700/30 dark:border-emerald-500/20'
                                : 'bg-gradient-to-br from-yellow-500 to-amber-500 dark:from-yellow-600 dark:to-amber-700 border border-yellow-600/30 dark:border-yellow-500/20'
                        }`}>
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <svg className={`w-9 h-9 ${
                                            userStatus === 'Verified' ? 'text-emerald-600' : 'text-yellow-600'
                                        }`} fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-medium mb-1 flex items-center gap-1 ${
                                            userStatus === 'Verified'
                                                ? 'text-emerald-100 dark:text-emerald-200'
                                                : 'text-yellow-100 dark:text-yellow-200'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                userStatus === 'Verified' ? 'bg-emerald-400' : 'bg-yellow-300'
                                            }`}></span>
                                            Current Profile Status
                                        </p>
                                        <h2 className="text-2xl md:text-3xl font-bold mb-1">Status: {statusDisplay.label}</h2>
                                        <p className={`text-xs flex items-center gap-1.5 ${
                                            userStatus === 'Verified'
                                                ? 'text-emerald-50/80 dark:text-emerald-100/70'
                                                : 'text-yellow-50/80 dark:text-yellow-100/70'
                                        }`}>
                                            <Calendar className="w-3.5 h-3.5" />
                                            Last medical update: Oct 24, 2025
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShareModalOpen(true)}
                                    className={`text-white font-semibold px-5 py-2.5 rounded-lg shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 text-sm ${
                                        userStatus === 'Verified'
                                            ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 border border-emerald-400/30'
                                            : 'bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 border border-yellow-300/30'
                                    }`}
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share Status
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
                                            <Link
                                                key={appointment.id}
                                                href={`/consultation/appointment/${appointment.id}`}
                                                className="block bg-card dark:bg-card/40 rounded-2xl p-5 border border-border dark:border-white/5 shadow-sm hover:shadow-md hover:border-veri5-teal/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer"
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
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-1" />
                                                </div>
                                            </Link>
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
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                    icon={Calendar}
                                    title="Book Appointment"
                                    description="Schedule a consultation with a specialist at your convenience."
                                    actionText="Book Now"
                                    href="/consultation"
                                    color="emerald"
                                />

                                <QuickActionCard
                                    icon={Activity}
                                    title="View Activity"
                                    description="Check your recent test results, appointments, and health updates."
                                    actionText="View All"
                                    href="/dashboard/activity"
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

            {/* Modals */}
            <ShareStatusModal open={shareModalOpen} onOpenChange={setShareModalOpen} />
            <ResultUploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
        </main>
    );
}