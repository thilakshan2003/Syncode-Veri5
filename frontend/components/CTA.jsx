import Button from './Button';

export default function CTA() {
    return (
        <section className="w-full bg-background py-24 border-t border-border">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
                    Ready to take control of your <br className="hidden md:block" />
                    sexual health privacy?
                </h2>
                <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of others who prioritize trust and responsibility. Your dignity is just a few clicks away.
                </p>
                <Button className="bg-veri5-teal hover:bg-veri5-teal/90 text-white rounded-full px-12 h-14 text-lg font-bold shadow-xl shadow-veri5-teal/30 hover:shadow-2xl hover:shadow-veri5-teal/40 transition-all transform hover:-translate-y-1">
                    Create Private Account
                </Button>
            </div>
        </section>
    )
}
