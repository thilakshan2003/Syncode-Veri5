"use client";

import { useState, useEffect } from 'react';
import { Share2, FlaskConical, Stethoscope, Clock, Package, ShieldCheck, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

// Icon mapping for different activity types
const activityIcons = {
    appointment: { icon: Stethoscope, color: 'text-purple-500', bg: 'bg-purple-50' },
    verification: { icon: FlaskConical, color: 'text-veri5-teal', bg: 'bg-cyan-50' },
    status_share_sent: { icon: ArrowUpRight, color: 'text-blue-500', bg: 'bg-blue-50' },
    status_share_received: { icon: ArrowDownRight, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    order: { icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' },
};

// Status badge colors
const statusColors = {
    // Appointment statuses
    booked: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-gray-100 text-gray-700',
    
    // Verification statuses
    verified: 'bg-emerald-100 text-emerald-700',
    unverified: 'bg-orange-100 text-orange-700',
    
    // Share statuses
    viewed: 'bg-green-100 text-green-700',
    active: 'bg-blue-100 text-blue-700',
    revoked: 'bg-red-100 text-red-700',
    
    // Order statuses
    created: 'bg-gray-100 text-gray-700',
    paid: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
};

export default function ActivityLog({ limit }) {
    const [filter, setFilter] = useState('all');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActivityLog();
    }, [limit]);

    const fetchActivityLog = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardApi.getActivityLog(limit || 50);
            
            if (response.success) {
                // Filter out received status shares with 'pending' status
                const filteredData = response.data.filter(item => {
                    if (item.type === 'status_share_received' && item.status === 'pending') {
                        return false;
                    }
                    return true;
                });
                setActivities(filteredData);
            }
        } catch (err) {
            console.error('Error fetching activity log:', err);
            setError('Failed to load activity log');
        } finally {
            setLoading(false);
        }
    };

    const filteredActivity = activities.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter || item.type.includes(filter);
    });

    const displayList = limit ? filteredActivity.slice(0, limit) : filteredActivity;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-veri5-teal animate-spin" />
                <span className="ml-3 text-slate-500">Loading activities...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full">
            {!limit && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                    {['all', 'appointment', 'verification', 'status_share', 'order'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap
                 ${filter === f
                                    ? 'bg-veri5-navy text-white shadow-md'
                                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            {f === 'all' ? 'All Activity' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-0 relative">
                {/* Timeline Line */}
                <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>

                {displayList.map((item) => {
                    const iconConfig = activityIcons[item.type] || { icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' };
                    const IconComponent = iconConfig.icon;
                    const statusColorClass = statusColors[item.status] || 'bg-gray-100 text-gray-700';

                    return (
                        <div key={item.id} className="flex gap-4 p-0 mb-6 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center border-4 border-white shadow-sm ${iconConfig.bg} ${iconConfig.color}`}>
                                <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex-grow pt-1">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-grow">
                                        <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full whitespace-nowrap">
                                        {item.timeAgo}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColorClass}`}>
                                        {item.status}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                        {item.type.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {displayList.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        No activity found. Start by booking an appointment or ordering a test kit!
                    </div>
                )}
            </div>
        </div>
    );
}