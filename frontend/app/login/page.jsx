"use client";

import Link from "next/link";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, MoveRight, ShieldCheck, EyeOff, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);
    const { login, googleLogin } = useAuth();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const onSubmit = async (data) => {
        try {
            setError("");
            await login(data);
        } catch (err) {
            setError(err);
        }
    };

    const handleGoogleResponse = async (response) => {
        try {
            setError("");
            console.log('🔵 [Login Page] Google response received');
            console.log('🔵 [Login Page] Credential length:', response.credential?.length);
            await googleLogin(response.credential);
        } catch (err) {
            console.error('❌ [Login Page] Error:', err);
            setError(err);
        }
    };

    const initializeGoogle = () => {
        console.log('🔵 [Google Init] Client ID from env:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
        console.log('🔵 [Google Init] window.google available:', !!window.google);

        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            });
            console.log('✅ [Google Init] Initialized successfully');
        } else {
            console.error('❌ [Google Init] window.google not available');
        }
    };

    const triggerGoogleLogin = () => {
        if (window.google) {
            window.google.accounts.id.prompt(); // Show one tap
            // Or render the invisible button to trigger the selector
            // For simplicity, we'll use prompt() or we could render a hidden button and click it
        }
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-950">
            {/* Header */}
            <div className="text-center mb-10 space-y-3">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <ShieldCheck className="w-8 h-8 text-veri5-teal dark:text-emerald-400" />
                    <span className="text-2xl font-bold tracking-tight text-veri5-navy dark:text-white">Veri5</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-veri5-navy dark:text-white tracking-tight">
                    Welcome back.
                </h1>
                <p className="text-gray-500 dark:text-slate-400 text-lg">
                    Privacy-first verification.{" "}
                    <span className="text-veri5-teal dark:text-emerald-400 font-medium">Safe & anonymous.</span>
                </p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-[2rem] border border-veri5-teal/30 dark:border-emerald-500/30 p-8 md:p-12 shadow-[0_0_40px_-10px_rgba(40,169,158,0.1)] dark:shadow-[0_0_40px_-10px_rgba(52,211,153,0.2)]">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-veri5-teal dark:group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-100 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-400/10 transition-all placeholder:text-gray-500 dark:placeholder:text-slate-600 text-gray-800 dark:text-white"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 dark:text-red-400 text-sm ml-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-veri5-teal dark:group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Enter password"
                                className="w-full bg-gray-100 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-400/10 transition-all placeholder:text-gray-500 dark:placeholder:text-slate-600 text-gray-800 dark:text-white"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 dark:text-red-400 text-sm ml-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-veri5-teal dark:bg-emerald-500 hover:bg-[#23968c] dark:hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2 group mt-4 shadow-lg shadow-veri5-teal/20 dark:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                        <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Create Account Link */}
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-slate-400">
                            New to Veri5?{" "}
                            <Link
                                href="/signup"
                                className="text-veri5-teal dark:text-emerald-400 hover:underline font-medium"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Google Auth - Expanded Option */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                    <Script
                        src="https://accounts.google.com/gsi/client"
                        onLoad={initializeGoogle}
                    />
                    <button
                        type="button"
                        onClick={() => triggerGoogleLogin()}
                        className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 active:scale-[0.98] text-gray-700 dark:text-white font-medium py-3.5 rounded-full transition-all flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>
                    <div id="google-hidden-button" className="hidden"></div>
                </div>
            </div>

            {/* Footer Trust Indicators */}
            <div className="mt-20 grid grid-cols-3 gap-8 md:gap-16 text-center max-w-2xl mx-auto">
                <div className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <LockKeyhole className="w-6 h-6 text-veri5-teal dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                            Encrypted
                        </h3>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">AES-256 standard</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <EyeOff className="w-6 h-6 text-veri5-teal dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                            Anonymous
                        </h3>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">Zero-knowledge</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ShieldCheck className="w-6 h-6 text-veri5-teal dark:text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">
                            Verified
                        </h3>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">Trust-anchored</p>
                    </div>
                </div>
            </div>

            {/* Footer Consent */}
            <div className="mt-16 text-center text-xs text-gray-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
                <p>
                    By signing in, you agree to our{" "}
                    <Link href="/privacy" className="text-veri5-teal dark:text-emerald-400 hover:underline">
                        Privacy Charter
                    </Link>
                </p>
                <p className="mt-1 opacity-75">
                    No personal data is shared without your explicit consent.
                </p>
            </div>
        </main>
    );
}
