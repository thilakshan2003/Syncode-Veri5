import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function QuickActionCard({ icon: Icon, title, description, actionText, href, color = "teal" }) {
    const colorStyles = {
        teal: "bg-teal-50 text-veri5-teal group-hover:bg-veri5-teal group-hover:text-white",
        blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
        purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
    };

    return (
        <Link href={href} className="group block h-full">
            <div className="bg-white rounded-3xl p-6 border border-slate-300 hover:border-emerald-500 shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${colorStyles[color]}`}>
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-grow">{description}</p>

                <div className="flex items-center text-sm font-bold text-slate-900 group-hover:text-veri5-teal transition-colors mt-auto">
                    {actionText} <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
