import { Shield, CheckCircle } from 'lucide-react';

export default function PrivacyBanner() {
    return (
        <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 bg-muted/30 rounded-2xl p-6 flex gap-4 border border-border">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shrink-0 shadow-sm text-primary">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-foreground">Privacy Guarantee</h3>
                        <a href="#" className="text-xs font-bold text-primary hover:underline flex items-center">
                            Security Protocol <ArrowRight className="w-3 h-3 ml-1" />
                        </a>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Medical records will be retained only by the specialist. No data is stored on our servers.
                        End-to-end encrypted consultations.
                    </p>
                </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 flex items-center justify-center gap-3 border border-primary/20">
                <CheckCircle className="w-8 h-8 text-primary" />
                <span className="font-bold text-primary text-lg">SLMC Certified Specialists</span>
            </div>
        </div>
    );
}

function ArrowRight({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    )
}
