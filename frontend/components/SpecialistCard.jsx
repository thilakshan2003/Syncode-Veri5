import { Star, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SpecialistCard({ name, role, experience, rating, availability, image, verifiedLints, id }) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-300 hover:border-emerald-500 shadow-lg transition-all group">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 overflow-hidden relative border-4 border-white shadow-md">
                    {/* Placeholder for real image, using UI avatar for now if no image provided */}
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-2xl">
                            {name.charAt(0)}
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-veri5-teal transition-colors">{name}</h3>
                <p className="text-veri5-teal font-medium text-sm mb-2">{role}</p>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> {experience}</span>
                    <span>&bull;</span>
                    <span className="flex items-center"><Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" /> {rating}</span>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                {verifiedLints && verifiedLints.map((item, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-600">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {item}
                    </div>
                ))}
            </div>

            <Link href={`/consultation/${id}/book`} className="block w-full">
                <Button className="w-full rounded-xl bg-slate-100 hover:bg-veri5-teal text-slate-700 hover:text-white font-bold transition-all h-12" onClick={() => console.log("Booking ID:", id)}>
                    Book Session <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
            </Link>
        </div>
    );
}
