import { FlaskConical, Activity, Share2 } from 'lucide-react';

const features = [
    {
        title: "Test",
        description: "Visit a partner lab for a screening or securely upload your existing certified health results.",
        icon: FlaskConical
    },
    {
        title: "Health Dashboard",
        description: "Our secure system validates data using zero-knowledge proofs without storing your identity or raw data.",
        icon: Activity
    },
    {
        title: "Share Status",
        description: "Share your status via the app to another user. Statuses are End to end encrypted and expire after a set duration.",
        icon: Share2
    }
];

export default function Features() {
    return (
        <section className="w-full bg-background py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple. Secure. Respectful.</h2>
                    <p className="text-gray-500 text-lg">We've redesigned the verification process to prioritize your dignity.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all duration-300">
                            <div className="w-14 h-14 bg-veri5-teal/10 rounded-xl flex items-center justify-center mb-6">
                                <feature.icon className="w-7 h-7 text-veri5-teal" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm md:text-base">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
