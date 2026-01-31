"use client";

import { useState, useEffect } from "react";
import { User, Shield, Check, Loader2, Link as LinkIcon, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ShareStatusModal({ open, onOpenChange }) {
    const [step, setStep] = useState('search'); // search, verifying, ready
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        setStep('verifying');

        // Simulate API verification delay
        setTimeout(() => {
            setStep('ready');
        }, 1500);
    };

    const reset = () => {
        setStep('search');
        setSearchTerm('');
        onOpenChange(false);
    }

    // Effect to reset when closed
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setStep('search');
                setSearchTerm('');
            }, 300);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={reset}>
            <DialogContent className="sm:max-w-[450px] bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">

                {/* Header Gradient */}
                <div className="bg-gradient-to-r from-veri5-navy to-[#1a3b5c] p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <div className="inline-flex bg-white/10 p-3 rounded-2xl mb-4 backdrop-blur-sm border border-white/10">
                        <Shield className="w-8 h-8 text-veri5-teal" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-white relative z-10">Secure Share</DialogTitle>
                    <p className="text-slate-300 text-xs mt-2 relative z-10">End-to-End Encrypted & Zero-Knowledge Proof</p>
                </div>

                <div className="p-6">
                    {step === 'search' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <p className="text-center text-slate-500 mb-6 text-sm">Enter a username to establish a secure, temporary connection for status verification.</p>
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Enter Username (e.g. alexj22)"
                                        className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
                                        autoFocus
                                    />
                                </div>
                                <Button type="submit" disabled={!searchTerm} className="w-full h-12 rounded-xl bg-veri5-navy hover:bg-navy-900 text-white font-bold">
                                    Verify Recipient
                                </Button>
                            </form>
                        </div>
                    )}

                    {step === 'verifying' && (
                        <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-veri5-teal rounded-full border-t-transparent animate-spin"></div>
                                <Lock className="absolute inset-0 m-auto w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Establishing Secure Channel</h3>
                            <p className="text-xs text-slate-400">Verifying public keys...</p>
                        </div>
                    )}

                    {step === 'ready' && (
                        <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-500">

                            {/* Creative Visual: Link Established */}
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-md z-10">
                                        <span className="font-bold text-xs text-slate-600">YOU</span>
                                    </div>
                                </div>

                                {/* Connection Line */}
                                <div className="flex-1 h-0.5 bg-gradient-to-r from-slate-200 via-emerald-400 to-slate-200 relative w-24">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 p-1.5 rounded-full border border-emerald-100">
                                        <Check className="w-3 h-3" strokeWidth={4} />
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center border-2 border-white shadow-md z-10">
                                        <span className="font-bold text-xs">{searchTerm.substring(0, 2).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Link Ready</h3>
                            <p className="text-sm text-slate-500 mb-6 px-4">
                                <span className="font-bold text-slate-900">{searchTerm}</span> will be able to view your verified status for <span className="text-veri5-teal font-bold">15 minutes</span>. No detailed medical data is shared.
                            </p>

                            <Button onClick={() => alert("Shared!")} className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 mb-3">
                                Confirm Share
                            </Button>
                            <Button variant="ghost" onClick={reset} className="text-slate-400 hover:text-slate-600 text-xs">
                                Cancel Connection
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Privacy Note */}
                <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5 font-medium uppercase tracking-wider">
                        <Lock className="w-3 h-3" /> 256-bit Encryption
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
