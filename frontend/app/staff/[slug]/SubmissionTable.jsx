"use client";

import { useState } from "react";
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    Upload,
    MoreVertical,
    Loader2,
    X,
    ShieldAlert,
    Check,
    History
} from "lucide-react";
import { updateTestStatus } from "./actions";
import { motion, AnimatePresence } from "framer-motion";

export default function SubmissionTable({ initialSubmissions }) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleUpdate = async (status) => {
        if (!selectedSubmission) return;
        setIsUpdating(true);
        try {
            const res = await updateTestStatus(selectedSubmission.id, status);
            if (res.success) {
                setSubmissions(prev => prev.map(s =>
                    s.id === selectedSubmission.id ? { ...s, status } : s
                ));
                setShowModal(false);
                setSelectedSubmission(null);
            }
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update status. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800/10 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                            <th className="px-6 py-4">Patient UUID</th>
                            <th className="px-6 py-4">Test Type</th>
                            <th className="px-6 py-4">Submission Date</th>
                            <th className="px-6 py-4">Current Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {submissions.map((sub) => (
                            <tr key={sub.id} className="group hover:bg-white/5 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700/50">
                                            <span className="text-xs font-bold text-[#2563EB]">{sub.patientUuid.substring(0, 2).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-white tracking-tight">{sub.patientUuid}</span>
                                            <p className="text-[10px] text-slate-500 font-medium">Verified Account</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm text-slate-300 font-medium">{sub.testType}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-300">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                        <span className="text-[10px] text-slate-500">{new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <StatusBadge status={sub.status} />
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button
                                        onClick={() => { setSelectedSubmission(sub); setShowModal(true); }}
                                        className="inline-flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-[#0F172A] px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 focus:ring-2 focus:ring-[#10B981]/50"
                                    >
                                        <Upload className="w-3.5 h-3.5" />
                                        Upload Result
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20, x: "-50%", y: "-50%" }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%", y: "-50%" }}
                            exit={{ opacity: 0, scale: 0.9, y: 20, x: "-50%", y: "-50%" }}
                            className="fixed top-1/2 left-1/2 w-full max-w-lg bg-[#1E293B] border border-slate-700/50 rounded-[2.5rem] shadow-2xl p-8 z-[201]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#10B981]/10 rounded-2xl flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-[#10B981]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Update Lab Result</h3>
                                        <p className="text-xs text-slate-400 mt-1">Patient: <span className="text-slate-200 font-mono">{selectedSubmission?.patientUuid}</span></p>
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 mb-8 flex items-start gap-4">
                                <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                    Updating a result status to "Verified" will immediately update the patient's current health status in the community. This action is permanently logged to your staff account for clinical accountability.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <StatusButton
                                    label="Verified"
                                    icon={<CheckCircle2 className="w-5 h-5" />}
                                    color="bg-[#10B981]"
                                    hover="hover:bg-[#059669]"
                                    onClick={() => handleUpdate("verified")}
                                    active={selectedSubmission?.status === "verified"}
                                    disabled={isUpdating}
                                />
                                <StatusButton
                                    label="Processing"
                                    icon={<RefreshCw className="w-5 h-5" />}
                                    color="bg-amber-500"
                                    hover="hover:bg-amber-600"
                                    onClick={() => handleUpdate("processing")}
                                    active={selectedSubmission?.status === "processing"}
                                    disabled={isUpdating}
                                />
                                <StatusButton
                                    label="Unverified"
                                    icon={<AlertCircle className="w-5 h-5" />}
                                    color="bg-red-500"
                                    hover="hover:bg-red-600"
                                    onClick={() => handleUpdate("unverified")}
                                    active={selectedSubmission?.status === "unverified"}
                                    disabled={isUpdating}
                                />
                                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col justify-center">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Audit Trail</span>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                                        <History className="w-3.5 h-3.5" />
                                        Logs enabled
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ status }) {
    const configs = {
        verified: { bg: "bg-emerald-500/10", text: "text-emerald-500", icon: <CheckCircle2 className="w-3 h-3" /> },
        processing: { bg: "bg-amber-500/10", text: "text-amber-500", icon: <Clock className="w-3 h-3" /> },
        unverified: { bg: "bg-red-500/10", text: "text-red-500", icon: <AlertCircle className="w-3 h-3" /> },
    };
    const config = configs[status] || configs.unverified;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
            {config.icon}
            {status}
        </span>
    );
}

function StatusButton({ label, icon, color, hover, onClick, active, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-5 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 h-28 relative overflow-hidden group ${active ? `${color} text-[#0F172A]` : `bg-slate-800 text-slate-300 border border-slate-700/50 ${hover} hover:text-white`}`}
        >
            <div className={`p-2 rounded-xl ${active ? 'bg-white/20' : 'bg-white/5'}`}>
                {icon}
            </div>
            <span className="text-xs font-bold tracking-wide">{label}</span>
            {active && (
                <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4" />
                </div>
            )}
        </button>
    );
}

function RefreshCw({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} animate-spin-slow`}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />
        </svg>
    );
}
