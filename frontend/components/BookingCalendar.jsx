"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// Mock calendar data for Jan 2026 (starting from screenshot context)
const dates = [
    { day: 29, month: 'prev' }, { day: 30, month: 'prev' }, { day: 31, month: 'prev' },
    { day: 1, month: 'current' }, { day: 2, month: 'current' }, { day: 3, month: 'current' }, { day: 4, month: 'current' },
    { day: 5, month: 'current', active: true }, { day: 6, month: 'current' }, { day: 7, month: 'current' }, { day: 8, month: 'current' },
    { day: 9, month: 'current' }, { day: 10, month: 'current' }, { day: 11, month: 'current' },
    { day: 12, month: 'current' }, { day: 13, month: 'current' }, { day: 14, month: 'current' },
    { day: 15, month: 'current' }, { day: 16, month: 'current' }, { day: 17, month: 'current' },
    { day: 18, month: 'current' }, { day: 19, month: 'current' }, { day: 20, month: 'current' },
    { day: 21, month: 'current' }, { day: 22, month: 'current' }, { day: 23, month: 'current' }, { day: 24, month: 'current' }
];

const timeSlots = [
    "09:00 AM", "10:30 AM",
    "01:00 PM", "02:30 PM",
    "04:00 PM", "05:30 PM"
];

export default function BookingCalendar({ onDateSelect, onTimeSelect, selectedDate, selectedTime }) {
    // In a real app, this would handle month navigation logic
    const currentMonth = "January 2026";

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">{currentMonth}</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200">
                        <ChevronLeft className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Calendar Grid */}
                <div>
                    <div className="grid grid-cols-7 mb-4">
                        {days.map(d => (
                            <div key={d} className="text-center text-[10px] font-bold text-slate-400 tracking-wider">
                                {d}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-4">
                        {dates.map((d, i) => (
                            <div key={i} className="flex justify-center">
                                <button
                                    disabled={d.month === 'prev'} // Just for visual placeholder logic
                                    onClick={() => onDateSelect(`Jan ${d.day}, 2026`)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                                    ${d.month === 'prev' ? 'text-slate-200' : 'text-slate-700 hover:bg-slate-50'}
                                    ${selectedDate === `Jan ${d.day}, 2026` || (d.active && !selectedDate) ? 'bg-veri5-teal text-white shadow-md hover:bg-veri5-teal' : ''}
                                `}
                                >
                                    {d.day}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Time Slots */}
                <div className="border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-12">
                    <h3 className="text-sm font-bold text-slate-900 mb-6">Available Times (IST)</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => onTimeSelect(time)}
                                className={`py-3 rounded-xl text-sm font-bold border transition-all
                                ${selectedTime === time
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                                        : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-200'}`
                                }
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                        <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Sessions are typically 30 minutes of dedicated private time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
