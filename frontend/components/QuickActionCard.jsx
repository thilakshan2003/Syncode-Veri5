import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function QuickActionCard({ icon: Icon, title, description, actionText, href, color = "teal" }) {
    const colorStyles = {
        teal: "bg-teal-50 dark:bg-teal-500/10 text-veri5-teal group-hover:bg-veri5-teal group-hover:text-white",
        blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
        purple: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
        emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
    };

    return (
        <Link href={href} className="group block h-full">
            <div className="bg-card rounded-3xl p-6 border border-border hover:border-primary hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] hover:-translate-y-1 shadow-sm transition-all duration-300 h-full flex flex-col cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 ${colorStyles[color]}`}>
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-primary mb-2 transition-colors duration-300">{title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">{description}</p>

                <div className="flex items-center text-sm font-bold text-foreground group-hover:text-primary transition-colors mt-auto">
                    {actionText} <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 duration-300" />
                </div>
            </div>
        </Link>
    );
}
