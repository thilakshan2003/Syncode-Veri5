import Navbar from '@/components/Navbar';
import { Shield, Lock, Eye, Database, FileCheck, UserCheck, AlertTriangle, CheckCircle, Server, Key, Globe, Smartphone } from 'lucide-react';

export default function SecurityProtocolPage() {
    const protocols = [
        {
            icon: Lock,
            title: "End-to-End Encryption",
            description: "All sensitive data is encrypted using industry-standard AES-256 encryption both in transit and at rest.",
            details: [
                "HTTPS/TLS 1.3 for all communications",
                "Encrypted database fields for health records",
                "Secure key management system"
            ],
            color: "bg-blue-500"
        },
        {
            icon: UserCheck,
            title: "Authentication & Authorization",
            description: "Multi-layered authentication system ensures only authorized users can access their data.",
            details: [
                "JWT token-based authentication",
                "HTTP-only secure cookies",
                "Role-based access control (RBAC)",
                "Session timeout after inactivity"
            ],
            color: "bg-emerald-500"
        },
        {
            icon: Database,
            title: "Data Privacy",
            description: "Your health data is private and never shared without explicit consent.",
            details: [
                "No sale of personal information",
                "GDPR & HIPAA compliant practices",
                "User-controlled data sharing",
                "Right to data deletion"
            ],
            color: "bg-purple-500"
        },
        {
            icon: Eye,
            title: "Privacy-First AI Validation",
            description: "Test kit validation runs entirely on your device - images never leave your phone.",
            details: [
                "Client-side TensorFlow.js inference",
                "No image storage on servers",
                "Only validation results transmitted",
                "Complete anonymity during testing"
            ],
            color: "bg-teal-500"
        },
        {
            icon: FileCheck,
            title: "Audit Logging",
            description: "All access to sensitive data is logged and monitored for security.",
            details: [
                "Comprehensive access logs",
                "Real-time anomaly detection",
                "Regular security audits",
                "Automated threat monitoring"
            ],
            color: "bg-orange-500"
        },
        {
            icon: Server,
            title: "Secure Infrastructure",
            description: "Enterprise-grade infrastructure with multiple layers of protection.",
            details: [
                "ISO 27001 certified hosting",
                "Regular penetration testing",
                "DDoS protection & firewalls",
                "Automated backup systems"
            ],
            color: "bg-indigo-500"
        }
    ];

    const practices = [
        {
            icon: Key,
            title: "Password Security",
            points: [
                "Bcrypt hashing with salt rounds",
                "Minimum password complexity requirements",
                "Protection against brute force attacks",
                "Secure password reset flow"
            ]
        },
        {
            icon: Globe,
            title: "Network Security",
            points: [
                "CORS protection configured",
                "Rate limiting on API endpoints",
                "SQL injection prevention",
                "XSS & CSRF protection"
            ]
        },
        {
            icon: Smartphone,
            title: "Mobile Security",
            points: [
                "Secure camera access controls",
                "Local processing of sensitive data",
                "No clipboard data access",
                "Biometric authentication support"
            ]
        }
    ];

    const certifications = [
        {
            name: "GDPR Compliant",
            description: "General Data Protection Regulation compliance for EU users"
        },
        {
            name: "HIPAA Aligned",
            description: "Health Insurance Portability and Accountability Act standards"
        },
        {
            name: "ISO 27001",
            description: "Information security management system certification"
        },
        {
            name: "SOC 2 Type II",
            description: "Service Organization Control 2 security standards"
        }
    ];

    return (
        <main className="min-h-screen bg-background transition-colors duration-300">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 py-12">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-veri5-teal/10 dark:bg-veri5-teal/20 rounded-full mb-6">
                        <Shield className="w-10 h-10 text-veri5-teal" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                        Security Protocols
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your privacy and security are our top priorities. We implement industry-leading security measures to protect your sensitive health information.
                    </p>
                </div>

                {/* Security Measures Grid */}
                <div className="max-w-7xl mx-auto mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Core Security Measures</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {protocols.map((protocol, index) => {
                            const Icon = protocol.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-card dark:bg-card/40 rounded-2xl p-6 border border-border dark:border-white/5 hover:shadow-xl transition-shadow"
                                >
                                    <div className={`w-12 h-12 ${protocol.color} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">
                                        {protocol.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {protocol.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {protocol.details.map((detail, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Best Practices */}
                <div className="max-w-7xl mx-auto mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Security Best Practices</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {practices.map((practice, index) => {
                            const Icon = practice.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 border border-border dark:border-white/5 shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-veri5-teal/10 dark:bg-veri5-teal/20 rounded-lg flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-veri5-teal" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">
                                            {practice.title}
                                        </h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {practice.points.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-veri5-teal flex-shrink-0 mt-1.5" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Certifications */}
                <div className="max-w-5xl mx-auto mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Compliance & Certifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {certifications.map((cert, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 bg-card dark:bg-card/40 rounded-2xl p-6 border border-border dark:border-white/5"
                            >
                                <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-1">{cert.name}</h3>
                                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Responsibilities */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-3">Your Role in Security</h3>
                                <p className="text-muted-foreground mb-4">
                                    While we implement robust security measures, your cooperation is essential:
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <span>Use strong, unique passwords and enable two-factor authentication</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <span>Never share your login credentials with anyone</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <span>Log out from shared devices after use</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <span>Report suspicious activity immediately</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <span>Keep your browser and operating system up to date</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-card dark:bg-card/40 rounded-2xl p-8 border border-border dark:border-white/5">
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                            Security Concerns?
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            If you discover a security vulnerability or have concerns about our security practices, please contact our security team immediately.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:security@veri5.com"
                                className="inline-flex items-center justify-center px-6 py-3 bg-veri5-teal text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors"
                            >
                                Report Security Issue
                            </a>
                            <a
                                href="/resources"
                                className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 dark:bg-slate-800 text-foreground font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                View Privacy Policy
                            </a>
                        </div>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="text-center mt-12 text-sm text-muted-foreground">
                    Last updated: February 10, 2026
                </div>
            </div>
        </main>
    );
}
