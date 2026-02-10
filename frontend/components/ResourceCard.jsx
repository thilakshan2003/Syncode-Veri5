import Link from 'next/link';
import { Clock } from 'lucide-react';

export default function ResourceCard({ id, title, description, category, readTime, imageUrl }) {
    // Map category to brand colors
    const categoryColors = {
        SAFE_SEX: "bg-teal-100 text-teal-700",
        CONSENT: "bg-orange-100 text-orange-700",
        MENTAL_HEALTH: "bg-blue-100 text-blue-700",
        SEXUAL_WELLBEING: "bg-pink-100 text-pink-700",
    };

    // Human-readable labels for categories
    const categoryLabels = {
        SAFE_SEX: "Safe Sex",
        CONSENT: "Consent",
        MENTAL_HEALTH: "Mental Health",
        SEXUAL_WELLBEING: "Sexual Wellbeing",
    };

    return (
        <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-veri5-teal shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:scale-[1.02]">
            {/* Image Section */}
            <div className="h-48 bg-slate-100 relative overflow-hidden">
                <Link href={`/resources/${id}`}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <span className="text-slate-400 text-sm font-medium">Veri5 Resource</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${categoryColors[category] || "bg-slate-100 text-slate-600"}`}>
                        {categoryLabels[category] || category}
                    </span>
                    <div className="flex items-center text-slate-400 text-[11px] font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {readTime}
                    </div>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 leading-tight group-hover:text-veri5-teal transition-colors">
                    <Link href={`/resources/${id}`}>{title}</Link>
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                    {description}
                </p>

                <div className="pt-4 border-t border-border">
                    <Link href={`/resources/${id}`} className="text-veri5-teal text-xs font-bold hover:underline flex items-center">
                        Read Article
                        <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}