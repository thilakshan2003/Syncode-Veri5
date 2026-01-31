import Image from 'next/image';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function ResourceCard({ title, excerpt, category, readTime, image }) {
    const categoryColors = {
        Health: "bg-teal-100 text-teal-700",
        Consent: "bg-orange-100 text-orange-700",
        Privacy: "bg-blue-100 text-blue-700",
        Relationships: "bg-pink-100 text-pink-700",
        Wellness: "bg-sky-100 text-sky-700",
        Ethics: "bg-purple-100 text-purple-700",
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-300 hover:border-emerald-500 shadow-lg transition-all group flex flex-col h-full">
            <div className="h-48 bg-slate-200 relative overflow-hidden">
                {/* Placeholder for image */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"></div>
                {image && <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${categoryColors[category] || "bg-slate-100 text-slate-600"}`}>
                        {category}
                    </span>
                    <span className="text-slate-400 text-xs font-medium flex items-center">
                        &bull; {readTime} read
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-veri5-teal transition-colors">
                    <Link href="#">{title}</Link>
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow">
                    {excerpt}
                </p>
            </div>
        </div>
    );
}
