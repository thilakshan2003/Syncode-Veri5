import Button from './Button';

export default function Hero() {
    return (
        <section className="w-full bg-veri5-navy py-24 md:py-32 relative overflow-hidden">
            {/* Background gradients or effects could go here */}

            <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">

                <div className="mb-8">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#1A3B5C] text-veri5-teal text-xs font-bold uppercase tracking-wide border border-[#2E4F73]">
                        Secure Verification
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
                    Your health, <br className="hidden md:block" />
                    <span className="text-veri5-teal">Your privacy</span>
                </h1>

                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                    A privacy-first sexual health verification platform focused on trust and dignity. Securely verify and share your status without compromising your identity.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                    <Button className="bg-veri5-teal hover:bg-veri5-teal/90 text-white rounded-full px-8 h-12 text-base font-semibold w-full sm:w-auto shadow-lg shadow-veri5-teal/20">
                        Get Started Now
                    </Button>
                    <Button className="bg-white text-veri5-navy hover:bg-gray-100 rounded-full px-8 h-12 text-base font-bold w-full sm:w-auto">
                        Our Privacy Policy
                    </Button>
                </div>
            </div>
        </section>
    );
}
