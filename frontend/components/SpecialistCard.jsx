import { Star, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SpecialistCard({ name, role, experience, rating, availability, image, verifiedLints, id }) {
    return (
        <div className="bg-card rounded-3xl p-6 border border-border hover:border-primary shadow-lg transition-all group flex flex-col h-full w-full">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-muted mb-4 overflow-hidden relative border-4 border-background shadow-md">
                    {/* Placeholder for real image, using UI avatar for now if no image provided */}
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-bold text-2xl">
                            {name.charAt(0)}
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{name}</h3>
                <p className="text-primary font-semibold text-sm mb-3">{role}</p>

                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> {experience}</span>
                    <span>&bull;</span>
                    <span className="flex items-center"><Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" /> {rating}</span>
                </div>
            </div>

            <div className="space-y-2.5 mb-6 flex-1">
                {verifiedLints && verifiedLints.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-200 font-medium leading-relaxed">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {item}
                    </div>
                ))}
            </div>

            <Link href={`/consultation/${id}/book`} className="block w-full mt-auto">
                <Button className="w-full rounded-xl bg-slate-100 hover:bg-veri5-teal text-slate-700 hover:text-white font-bold transition-all h-12">
                    Book Session <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
            </Link>
        </div>
    );
}
