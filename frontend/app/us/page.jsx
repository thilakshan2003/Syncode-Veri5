import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'About Us - Veri5',
    description: 'Learn about Veri5 and our mission to deliver secure, private sexual health services.',
};

export default function AboutUsPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">About Veri5</h1>
                    <p className="text-muted-foreground text-lg mb-10">
                        Veri5 is a privacy-first health platform that helps people access testing,
                        consultations, and verified status sharing with confidence.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-foreground mb-2">Our Mission</h2>
                        <p className="text-muted-foreground">
                            Make sexual health services simple, respectful, and secure for everyone.
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-foreground mb-2">What We Do</h2>
                        <p className="text-muted-foreground">
                            We connect users with verified clinics, specialists, and tools for
                            confidential testing and status sharing.
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-foreground mb-2">Privacy First</h2>
                        <p className="text-muted-foreground">
                            We minimize data retention and use secure workflows to protect every user.
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-foreground mb-2">Built for Trust</h2>
                        <p className="text-muted-foreground">
                            Transparent policies and verified partners keep your experience reliable.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
