"use client";

import { use, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BookingSummary from '@/components/BookingSummary';
import { ArrowLeft, Calendar, MapPin, Video, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { dashboardApi, appointmentApi } from '@/lib/api';

export default function ViewAppointmentPage(props) {
    const params = use(props.params);
    const router = useRouter();
    const { user } = useAuth();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchAppointment();
    }, [user, params.appointmentId]);

    const fetchAppointment = async () => {
        try {
            setLoading(true);
            const response = await dashboardApi.getUserAppointments();
            
            if (response.success) {
                const found = response.data.find(apt => apt.id === params.appointmentId);
                if (!found) {
                    setError('Appointment not found');
                    return;
                }
                setAppointment(found);
            }
        } catch (err) {
            console.error('Error fetching appointment:', err);
            setError(err.message || 'Failed to load appointment');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async () => {
        if (!confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
            return;
        }

        try {
            await appointmentApi.cancelAppointment(params.appointmentId);
            alert('Appointment cancelled successfully!');
            router.push('/dashboard');
        } catch (err) {
            console.error('Error cancelling appointment:', err);
            alert(err.response?.data?.error || 'Failed to cancel appointment');
        }
    };

    if (loading) return <div className="text-center py-20">Loading appointment details...</div>;
    if (error || !appointment) return (
        <div className="text-center py-20">
            <div className="text-red-500 mb-4">{error || 'Appointment not found'}</div>
            <Link href="/dashboard" className="text-veri5-teal hover:underline">
                Return to Dashboard
            </Link>
        </div>
    );

    // Format date and time from appointmentDate
    const appointmentDate = appointment.appointmentDate ? new Date(appointment.appointmentDate) : null;
    const formattedDate = appointmentDate?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    }) || 'Not scheduled';
    const formattedTime = appointmentDate?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    }) || '';

    // Calculate cost (convert cents to rupees)
    const cost = appointment.priceCents 
        ? (appointment.priceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '0.00';

    const doctor = {
        name: appointment.practitionerName || 'Unknown Doctor',
        role: appointment.specialization || 'Specialist',
        image: ''
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Back Link */}
                    <Link 
                        href="/dashboard" 
                        className="inline-flex items-center text-muted-foreground hover:text-primary font-medium mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Appointment Details */}
                        <div className="lg:col-span-2">
                            <h1 className="text-3xl font-extrabold text-foreground mb-8">Appointment Details</h1>

                            {/* Status Badge */}
                            <div className="mb-6">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                                    appointment.status === 'booked' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                                }`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </span>
                            </div>

                            {/* Appointment Information Cards */}
                            <div className="space-y-4">
                                {/* Practitioner Info */}
                                <div className="bg-card dark:bg-card/40 rounded-2xl p-6 border border-border">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                        <User className="w-5 h-5" />
                                        <h3 className="font-bold text-foreground">Practitioner</h3>
                                    </div>
                                    <p className="text-lg font-semibold text-foreground">{appointment.practitionerName}</p>
                                    {doctor.role && (
                                        <p className="text-sm text-primary mt-1">{doctor.role}</p>
                                    )}
                                </div>

                                {/* Date & Time */}
                                <div className="bg-card dark:bg-card/40 rounded-2xl p-6 border border-border">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                        <Calendar className="w-5 h-5" />
                                        <h3 className="font-bold text-foreground">Date & Time</h3>
                                    </div>
                                    <p className="text-lg font-semibold text-foreground">{formattedDate}</p>
                                    {formattedTime && (
                                        <p className="text-sm text-muted-foreground mt-1">{formattedTime}</p>
                                    )}
                                </div>

                                {/* Location/Mode */}
                                <div className="bg-card dark:bg-card/40 rounded-2xl p-6 border border-border">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                        {appointment.mode === 'online' ? (
                                            <Video className="w-5 h-5" />
                                        ) : (
                                            <MapPin className="w-5 h-5" />
                                        )}
                                        <h3 className="font-bold text-foreground">
                                            {appointment.mode === 'online' ? 'Online Consultation' : 'Location'}
                                        </h3>
                                    </div>
                                    <p className="text-lg font-semibold text-foreground">
                                        {appointment.mode === 'online' 
                                            ? 'Video Call Session' 
                                            : appointment.clinicName || 'Physical Visit'}
                                    </p>
                                    {appointment.mode !== 'online' && appointment.clinicAddress && (
                                        <p className="text-sm text-muted-foreground mt-1">{appointment.clinicAddress}</p>
                                    )}
                                </div>
                            </div>

                            {/* Warning for Cancelled */}
                            {appointment.status === 'cancelled' && (
                                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl">
                                    <p className="font-semibold">This appointment has been cancelled.</p>
                                    <p className="text-sm mt-1">If you need to rebook, please visit the consultation page.</p>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Summary Sidebar with Cancel Button */}
                        <div>
                            <BookingSummary
                                doctor={doctor}
                                selectedDate={formattedDate}
                                selectedTime={formattedTime}
                                mode={appointment.mode === 'online' ? 'Online' : 'Physical'}
                                cost={cost}
                                appointmentId={appointment.id}
                                onCancel={handleCancelAppointment}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
