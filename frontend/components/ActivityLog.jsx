"use client";

import { useState } from 'react';
import { Share2, FlaskConical, Stethoscope, Clock } from 'lucide-react';

const mockActivity = [
    { id: 1, type: 'share', title: 'Shared status with Alex M.', time: '2 hours ago', icon: Share2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 2, type: 'test', title: 'Test Kit Ordered (Standard)', time: '1 day ago', icon: FlaskConical, color: 'text-veri5-teal', bg: 'bg-cyan-50' },
    { id: 3, type: 'consultation', title: 'Consultation with Dr. Perera', time: '3 days ago', icon: Stethoscope, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 4, type: 'share', title: 'Shared status with Sarah K.', time: '5 days ago', icon: Share2, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 5, type: 'test', title: 'Result Verified (Negative)', time: '1 week ago', icon: FlaskConical, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function ActivityLog({ limit }) {
    const [filter, setFilter] = useState('all');

    const filteredActivity = mockActivity.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    const displayList = limit ? filteredActivity.slice(0, limit) : filteredActivity;

    return (
        <div className="w-full">
            {!limit && (
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                    {['all', 'share', 'test', 'consultation'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap
                 ${filter === f
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-background border border-border text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                        >
                            {f === 'all' ? 'All Activity' : f + 's'}
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-0 relative">
                {/* Timeline Line */}
                <div className="absolute left-[29px] top-4 bottom-4 w-0.5 bg-border z-0"></div>

                {displayList.map((item) => (
                    <div key={item.id} className="flex gap-4 p-0 mb-6 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center border-4 border-background shadow-sm ${item.bg.replace('bg-', 'bg-').replace('-50', '-500/10')} ${item.color}`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-grow pt-1">
                            <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                                <span className="text-[10px] font-bold text-muted-foreground bg-accent px-2 py-1 rounded-full">{item.time}</span>
                            </div>
                            <div className="text-xs font-bold text-muted-foreground/30 uppercase tracking-wider mt-1">{item.type}</div>
                        </div>
                    </div>
                ))}

                {displayList.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-sm">No activity found.</div>
                )}
            </div>
        </div>
    );
}
