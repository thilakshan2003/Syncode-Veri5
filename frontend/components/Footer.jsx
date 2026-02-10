import Link from 'next/link';
import { ShieldCheck, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-background dark:bg-[#0B1120] border-t border-border dark:border-white/5 pt-20 pb-12 mt-20 transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                            <span className="text-2xl font-bold text-foreground tracking-tight">Veri5</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            Secure, private, and verified sexual health testing and status sharing. Empowering you to take control of your health.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Health Dashboard</Link></li>
                            <li><Link href="/testing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Testing Options</Link></li>
                            <li><Link href="/consultation" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Consultations</Link></li>
                            <li><Link href="/resources" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Resources</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Partner with Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground text-xs">
                        &copy; {new Date().getFullYear()} Veri5 Health Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-muted-foreground font-medium">
                        <Link href="#">Privacy</Link>
                        <Link href="#">Terms</Link>
                        <Link href="#">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
