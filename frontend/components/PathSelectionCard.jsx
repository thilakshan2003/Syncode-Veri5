import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PathSelectionCard({ icon: Icon, title, description, benefits, buttonText, buttonLink, badge }) {
    return (
        <div className="bg-card rounded-3xl p-8 border border-border hover:border-primary shadow-lg transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden group">

            <div className='w-full flex justify-between items-start mb-6'>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon className="w-7 h-7" strokeWidth={2.5} />
                </div>

                {badge && (
                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                        {badge}
                    </span>
                )}
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed text-[15px]">{description}</p>

            <div className="space-y-3 mb-10 w-full flex-grow">
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span>{benefit}</span>
                    </div>
                ))}
            </div>

            <div className="w-full mt-auto">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
                    <Link href={buttonLink}>
                        {buttonText} <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
