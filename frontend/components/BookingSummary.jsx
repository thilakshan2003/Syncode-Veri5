import { ShieldCheck, Video, Calendar, Clock, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingSummary({ doctor, selectedDate, selectedTime, cost, mode = "Online", onBook }) {
    return (
        <div className="bg-card rounded-3xl p-6 border border-border hover:border-primary shadow-xl shadow-background/50 transition-all sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">Booking Summary</h2>

            {/* Doctor Info */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden relative">
                    {/* Image Placeholder */}
                    {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-bold text-xl">
                            {doctor.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-foreground">{doctor.name}</h3>
                    <p className="text-primary font-medium text-sm">{doctor.role}</p>
                </div>
            </div>

            {/* Session Details */}
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Date</span>
                    <span className="font-bold text-foreground">{selectedDate || "Select a date"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Time</span>
                    <span className="font-bold text-foreground">{selectedTime || "Select a time"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Session Type</span>
                    <div className="flex items-center font-bold text-slate-900">
                        {mode === 'Online' ? (
                            <><Video className="w-4 h-4 mr-2 text-veri5-teal" /> Video Call</>
                        ) : (
                            <><ShieldCheck className="w-4 h-4 mr-2 text-veri5-teal" /> Physical Visit</>
                        )}
                    </div>
                </div>
            </div>

            {/* Cost Area */}
            <div className="bg-primary/10 rounded-2xl p-6 flex items-center justify-between mb-8">
                <span className="font-bold text-foreground">Session Cost</span>
                <span className="font-extrabold text-2xl text-foreground">Rs. {cost}</span>
            </div>

            {/* Action Button */}
            <Button
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl shadow-lg shadow-primary/30 mb-4 text-base"
                disabled={!selectedDate || !selectedTime}
                onClick={onBook}
            >
                <Lock className="w-4 h-4 mr-2" /> Book Private Session
            </Button>

            <p className="text-[10px] text-center text-muted-foreground leading-relaxed px-4">
                No charges until the session starts. <br />
                Cancel up to 24 hours before for a full refund.
            </p>
        </div>
    );
}
