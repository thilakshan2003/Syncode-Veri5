import { Building2, PlusCircle, ShieldCheck, Microscope } from 'lucide-react';

const partners = [
    { name: "LANKA HOSPITALS", icon: PlusCircle },
    { name: "MEDIHELP", icon: Building2 },
    { name: "KNOW4SURE", icon: ShieldCheck },
    { name: "ASIRI LABORATORIES", icon: Microscope },
];

export default function TrustedBy() {
    return (
        <section className="w-full bg-background pb-24 pt-0">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">Trusted by leading health institutions</p>

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {partners.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-default">
                            <p.icon className="h-6 w-6 text-veri5-teal" strokeWidth={2.5} />
                            <span className="text-lg md:text-xl font-bold text-slate-400 font-sans tracking-tight">{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
