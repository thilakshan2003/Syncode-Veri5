"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, Loader2, Sparkles } from "lucide-react";

export default function StaffLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid credentials or unauthorized access.");
            } else {
                // Fetch the session to get the clinicSlug
                const res = await fetch("/api/auth/session");
                const session = await res.json();
                if (session?.user?.clinicSlug) {
                    router.push(`/staff/${session.user.clinicSlug}`);
                } else {
                    setError("Failed to resolve clinic information.");
                }
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-[100px] -ml-48 -mb-48" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-[#1E293B] border border-slate-800 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-[#10B981]/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <ShieldCheck className="w-9 h-9 text-[#10B981]" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Veri5 Clinical</h1>
                        <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Staff Portal Access</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Staff Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#10B981] transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full bg-[#0F172A] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#10B981] transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0F172A] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#10B981] hover:bg-[#059669] text-[#0F172A] font-bold py-4 rounded-2xl shadow-xl shadow-[#10B981]/20 transition-all duration-300 flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-800 text-center">
                        <p className="text-slate-500 text-xs leading-relaxed">
                            Authorized personnel only. All access attempts are logged and monitored for medical accountability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
