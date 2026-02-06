"use client";

import { useState, useEffect } from 'react';
import { Eye, Shield, Clock, User } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

export default function StatusWatchCard() {
    const [receivedShares, setReceivedShares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReceivedShares();
    }, []);

    const fetchReceivedShares = async () => {
        try {
            setLoading(true);
            const response = await dashboardApi.getReceivedShares();
            
            if (response.success) {
                // Filter out expired shares
                const activeShares = response.data.filter(share => !share.isExpired);
                setReceivedShares(activeShares);
            }
        } catch (err) {
            console.error('Error fetching received shares:', err);
            setError('Failed to load status shares');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'Verified') {
            return {
                color: 'bg-emerald-500',
                textColor: 'text-emerald-600',
                bgColor: 'bg-emerald-50',
                label: 'Verified'
            };
        } else {
            return {
                color: 'bg-yellow-500',
                textColor: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                label: 'Not Verified'
            };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `${diffMinutes} minutes`;
        }
        return `${diffHours} hours`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Status Watch</h3>
                    <Eye className="w-5 h-5 text-veri5-teal" />
                </div>
                <p className="text-sm text-slate-400 text-center py-8">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Status Watch</h3>
                    <Eye className="w-5 h-5 text-veri5-teal" />
                </div>
                <p className="text-sm text-red-500 text-center py-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Status Watch</h3>
                <Eye className="w-5 h-5 text-veri5-teal" />
            </div>

            {receivedShares.length === 0 ? (
                <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">No status shares received</p>
                    <p className="text-xs text-slate-300 mt-1">When someone shares their status with you, it will appear here</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {receivedShares.map((share) => {
                        const badge = getStatusBadge(share.senderStatus);
                        return (
                            <div
                                key={share.id}
                                className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-veri5-teal transition-all"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-veri5-navy flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">
                                                {share.senderUsername}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Shared with you
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`${badge.bgColor} ${badge.textColor} text-xs font-bold px-2 py-1 rounded-full`}>
                                        {badge.label}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                        {share.isViewed ? 'Viewed' : 'Expires in'} {!share.isViewed && formatDate(share.expiresAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
