"use client";

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function BookingCalendar({ onDateSelect, onTimeSelect, selectedDate, selectedTime, availableSlots = [], mode = 'Online' }) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const currentMonthLabel = new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

    const toDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Filter slots by mode
    const filteredSlots = useMemo(() => {
        return availableSlots.filter(slot =>
            mode === 'Online' ? slot.mode === 'online' : slot.mode === 'physical'
        );
    }, [availableSlots, mode]);

    // Get unique dates with availability
    const availableDates = useMemo(() => {
        const dates = new Set();
        filteredSlots.forEach(slot => {
            const d = new Date(slot.startsAt);
            dates.add(toDateKey(d));
        });
        return dates;
    }, [filteredSlots]);

    const getCalendarDays = () => {
        const year = currentYear;
        const month = currentMonth;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = [];

        // Padding for start of month (Mon=1, Sun=0, adjusted to Mon=0)
        let startDay = firstDay.getDay() - 1;
        if (startDay === -1) startDay = 6;

        // Previous month padding
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = 0; i < startDay; i++) {
            daysInMonth.push({ day: prevMonthLastDay - startDay + 1 + i, month: 'prev' });
        }

        // Current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dateObj = new Date(year, month, i);
            const dateStr = toDateKey(dateObj);
            daysInMonth.push({
                day: i,
                month: 'current',
                active: availableDates.has(dateStr),
                fullDate: dateStr
            });
        }

        return daysInMonth;
    };

    const calendarDays = getCalendarDays();

    // Get times for selected date
    const availableTimes = useMemo(() => {
        if (!selectedDate) return [];

        return filteredSlots
            .filter(slot => {
                const d = new Date(slot.startsAt);
                return toDateKey(d) === selectedDate;
            })
            .map(slot => ({
                id: slot.id,
                label: new Date(slot.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                value: new Date(slot.startsAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                // Using formatted time string as value to match parent state expectation
            }))
            .sort((a, b) => new Date('1970/01/01 ' + a.label) - new Date('1970/01/01 ' + b.label)); // Simple time sort
    }, [selectedDate, filteredSlots]);


    return (
        <div className="bg-card rounded-3xl p-8 border border-border hover:border-primary shadow-lg transition-all">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentMonthLabel}</h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-border"
                        onClick={() => {
                            if (currentMonth === 0) {
                                setCurrentMonth(11);
                                setCurrentYear(currentYear - 1);
                            } else {
                                setCurrentMonth(currentMonth - 1);
                            }
                        }}
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-border"
                        onClick={() => {
                            if (currentMonth === 11) {
                                setCurrentMonth(0);
                                setCurrentYear(currentYear + 1);
                            } else {
                                setCurrentMonth(currentMonth + 1);
                            }
                        }}
                        aria-label="Next month"
                    >
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Calendar Grid */}
                <div>
                    <div className="grid grid-cols-7 mb-4">
                        {days.map(d => (
                            <div key={d} className="text-center text-[10px] font-bold text-muted-foreground tracking-wider">
                                {d}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-4">
                        {calendarDays.map((d, i) => (
                            <div key={i} className="flex justify-center">
                                <button
                                    disabled={d.month === 'prev' || !d.active}
                                    onClick={() => d.active && onDateSelect(d.fullDate)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                                    ${d.month === 'prev' ? 'text-slate-600/40 dark:text-slate-400/30' : ''}
                                    ${!d.active ? 'text-slate-500/50 dark:text-slate-400/40 cursor-not-allowed' : 'cursor-pointer text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400'}
                                    ${selectedDate === d.fullDate ? '!bg-veri5-teal !text-white shadow-md' : ''}
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
                    <h3 className="text-sm font-bold text-slate-900 mb-6">Available Times (Local)</h3>

                    {availableTimes.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {availableTimes.map(timeObj => (
                                <button
                                    key={timeObj.id}
                                    onClick={() => onTimeSelect(timeObj.value)}
                                    className={`py-3 rounded-xl text-sm font-bold border transition-all
                                    ${selectedTime === timeObj.value
                                            ? 'bg-veri5-teal border-veri5-teal text-white shadow-md'
                                            : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-200'}`
                                    }
                                >
                                    {timeObj.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="mb-8 text-sm text-slate-400 italic">
                            {selectedDate ? "No times available for this date." : "Select a date to view times."}
                        </div>
                    )}

                    <div className="flex items-start gap-3 bg-muted/50 p-4 rounded-xl">
                        <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Sessions are typically 30 minutes of dedicated private time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
