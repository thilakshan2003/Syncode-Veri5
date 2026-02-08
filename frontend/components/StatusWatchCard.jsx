"use client";

import { useState, useEffect } from 'react';
import { Eye, Shield, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
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
                textColor: 'text-emerald-700',
                bgColor: 'bg-emerald-50',
                borderColor: 'border-emerald-200',
                icon: CheckCircle,
                label: 'Verified'
            };
        } else {
            return {
                color: 'bg-amber-500',
                textColor: 'text-amber-700',
                bgColor: 'bg-amber-50',
                borderColor: 'border-amber-200',
                icon: AlertCircle,
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
            return `${diffMinutes}m`;
        }
        if (diffHours < 24) {
            return `${diffHours}h`;
        }
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d`;
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border border-slate-100 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-veri5-teal/10 rounded-xl">
                        <Eye className="w-6 h-6 text-veri5-teal" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Status Watch</h3>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-veri5-teal"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border border-slate-100 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-veri5-teal/10 rounded-xl">
                        <Eye className="w-6 h-6 text-veri5-teal" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Status Watch</h3>
                </div>
                <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-teal-50/20 rounded-3xl p-8 border border-slate-100 shadow-lg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-veri5-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-veri5-teal to-emerald-500 rounded-xl shadow-lg shadow-teal-500/20">
                            <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Status Watch</h3>
                            <p className="text-xs text-slate-500">Shared statuses from your connections</p>
                        </div>
                    </div>
                    {receivedShares.length > 0 && (
                        <div className="bg-veri5-teal/10 px-3 py-1 rounded-full">
                            <span className="text-sm font-bold text-veri5-teal">{receivedShares.length} active</span>
                        </div>
                    )}
                </div>

                {receivedShares.length === 0 ? (
                    <div className="text-center py-12 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="inline-flex p-4 bg-slate-100 rounded-2xl mb-4">
                            <Shield className="w-12 h-12 text-slate-300" />
                        </div>
                        <p className="text-base font-semibold text-slate-600 mb-1">No Status Shares Yet</p>
                        <p className="text-sm text-slate-400 max-w-md mx-auto">
                            When someone shares their verification status with you, you'll see it here
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {receivedShares.map((share, index) => {
                            const badge = getStatusBadge(share.senderStatus);
                            const StatusIcon = badge.icon;
                            return (
                                <div
                                    key={share.id}
                                    className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-veri5-teal hover:shadow-xl transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Header with Avatar and Status */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-veri5-navy to-slate-700 flex items-center justify-center shadow-lg ring-2 ring-white">
                                                    <span className="text-white font-bold text-sm">
                                                        {share.senderUsername.substring(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                                {/* Status indicator dot */}
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${badge.color} rounded-full border-2 border-white shadow-sm`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-slate-800 truncate">
                                                    {share.senderUsername}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Shared status
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`${badge.bgColor} ${badge.borderColor} border-2 rounded-xl p-3 mb-3 transition-transform group-hover:scale-105`}>
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className={`w-5 h-5 ${badge.textColor}`} />
                                            <span className={`${badge.textColor} text-sm font-bold`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Footer with expiry */}
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>
                                                {share.isViewed ? 'Viewed' : `Expires in ${formatDate(share.expiresAt)}`}
                                            </span>
                                        </div>
                                        {share.isViewed && (
                                            <div className="flex items-center gap-1 text-emerald-600">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                <span className="font-medium">Seen</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
