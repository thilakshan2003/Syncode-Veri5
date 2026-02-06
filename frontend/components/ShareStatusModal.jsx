"use client";

import { useState, useEffect } from "react";
import { User, Shield, Check, Loader2, Link as LinkIcon, Lock, Copy, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "@/lib/api";

export default function ShareStatusModal({ open, onOpenChange }) {
    const [step, setStep] = useState('search'); // search, verifying, ready
    const [searchTerm, setSearchTerm] = useState('');
    const [shareLink, setShareLink] = useState('');
    const [expiryHours, setExpiryHours] = useState(24);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        
        setStep('verifying');
        setError(null);
        setLoading(true);

        try {
            // Create status share
            const response = await dashboardApi.createStatusShare({
                recipientUsername: searchTerm,
                expiryHours: expiryHours,
                maxViews: 1
            });

            if (response.success) {
                // Generate the share link with token
                const baseUrl = window.location.origin;
                const link = `${baseUrl}/status-view/${response.data.token}`;
                setShareLink(link);
                setStep('ready');
            }
        } catch (err) {
            console.error('Error creating status share:', err);
            setError(err.response?.data?.error || 'Failed to create status share');
            setStep('search');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const reset = () => {
        setStep('search');
        setSearchTerm('');
        setShareLink('');
        setError(null);
        setCopied(false);
        onOpenChange(false);
    }

    // Effect to reset when closed
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setStep('search');
                setSearchTerm('');
                setShareLink('');
                setError(null);
                setCopied(false);
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
                            
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-xs text-red-600 text-center">{error}</p>
                                </div>
                            )}
                            
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
                                
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-600 font-medium">Link Expiry</label>
                                    <select
                                        value={expiryHours}
                                        onChange={(e) => setExpiryHours(Number(e.target.value))}
                                        className="w-full h-10 px-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm"
                                    >
                                        <option value={1}>1 hour</option>
                                        <option value={6}>6 hours</option>
                                        <option value={24}>24 hours</option>
                                        <option value={72}>3 days</option>
                                    </select>
                                </div>
                                
                                <Button type="submit" disabled={!searchTerm || loading} className="w-full h-12 rounded-xl bg-veri5-navy hover:bg-navy-900 text-white font-bold">
                                    {loading ? 'Creating...' : 'Create Share Link'}
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
                                <span className="font-bold text-slate-900">{searchTerm}</span> will be able to view your verified status for <span className="text-veri5-teal font-bold">{expiryHours} {expiryHours === 1 ? 'hour' : 'hours'}</span>. No detailed medical data is shared.
                            </p>

                            {/* Share Link Box */}
                            <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-xs text-slate-500 mb-2">Share this link:</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={shareLink}
                                        readOnly
                                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                                    />
                                    <Button
                                        onClick={copyToClipboard}
                                        size="sm"
                                        className="bg-veri5-teal hover:bg-teal-600"
                                    >
                                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                {copied && (
                                    <p className="text-xs text-emerald-600 mt-2">✓ Copied to clipboard!</p>
                                )}
                            </div>

                            <Button onClick={reset} className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 mb-3">
                                Done
                            </Button>
                            <Button variant="ghost" onClick={reset} className="text-slate-400 hover:text-slate-600 text-xs">
                                Create Another
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
