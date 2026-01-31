import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PathSelectionCard({ icon: Icon, title, description, benefits, buttonText, buttonLink, badge }) {
    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-300 hover:border-emerald-500 shadow-lg transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden group">

            <div className='w-full flex justify-between items-start mb-6'>
                <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-veri5-teal group-hover:bg-veri5-teal group-hover:text-white transition-colors duration-300">
                    <Icon className="w-7 h-7" strokeWidth={2.5} />
                </div>

                {badge && (
                    <span className="bg-cyan-50 text-veri5-teal text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                        {badge}
                    </span>
                )}
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 mb-8 leading-relaxed text-[15px]">{description}</p>

            <div className="space-y-3 mb-10 w-full flex-grow">
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{benefit}</span>
                    </div>
                ))}
            </div>

            <div className="w-full mt-auto">
                <Button asChild className="w-full bg-veri5-teal hover:bg-teal-600 text-white rounded-xl h-12 font-bold shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all">
                    <Link href={buttonLink}>
                        {buttonText} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
