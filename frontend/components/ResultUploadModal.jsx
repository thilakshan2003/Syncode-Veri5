"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Schema Validation
const formSchema = z.object({
    veri5Id: z.string().regex(/^v5-\d{4}-[a-zA-Z0-9]{4}$/i, "Format must be v5-xxxx-xxxx"),
    date: z.string().min(1, "Date is required"),
    testType: z.string().min(1, "Please select a test type"),
    file: z.any()
    // In a real app we'd validate fileList length here
    //.refine((files) => files?.length > 0, "Image is required")
});

export default function ResultUploadModal({ open, onOpenChange }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data) => {
        console.log("Form Data:", data);
        // Handle submission logic
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white gap-0 rounded-3xl border-0 shadow-2xl">
                <div className="flex flex-col md:flex-row h-full">

                    {/* Left/Top: Image Preview or Illustration */}
                    <div className="bg-slate-50 p-8 flex flex-col justify-center items-center gap-4 md:w-5/12 border-r border-slate-100/50">
                        <div className="relative w-48 h-48 bg-white rounded-2xl shadow-sm border border-slate-200 rotate-[-3deg] overflow-hidden p-2">
                            {/* Mock Kit Image */}
                            <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-[10px]">
                                KIT PREVIEW
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold text-slate-800">Standard Screen</h4>
                            <p className="text-xs text-slate-500">Checks for 7 common infections</p>
                            <p className="mt-2 font-bold text-slate-900 text-lg">Rs. 2800</p>
                        </div>
                    </div>

                    {/* Right/Bottom: Form */}
                    <div className="p-8 md:p-10 md:w-7/12 relative">


                        <DialogHeader className="mb-6 text-left">
                            <DialogTitle className="text-xl font-bold text-teal-700 hidden">Submit Result</DialogTitle>
                            {/* Using custom header UI instead */}
                            <div className="flex justify-between items-center mb-6">
                                {/* Placeholder for header content if needed */}
                            </div>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-veri5-teal uppercase tracking-widest">Veri5 ID</label>
                                    <input
                                        placeholder="v5-7829-ax42"
                                        {...register("veri5Id")}
                                        className="w-full h-12 px-4 rounded-xl bg-white border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300"
                                    />
                                    {errors.veri5Id && <span className="text-xs text-red-500 font-medium">{errors.veri5Id.message}</span>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-veri5-teal uppercase tracking-widest">Date</label>
                                    <input
                                        type="text"
                                        placeholder="January 18, 2026"
                                        {...register("date")}
                                        className="w-full h-12 px-4 rounded-xl bg-white border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300"
                                    />
                                    {errors.date && <span className="text-xs text-red-500 font-medium">{errors.date.message}</span>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-veri5-teal uppercase tracking-widest">Test Type</label>
                                <div className="relative">
                                    <select
                                        {...register("testType")}
                                        className="w-full h-12 px-4 rounded-xl bg-slate-100/50 border-2 border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none appearance-none text-sm font-medium text-slate-500"
                                    >
                                        <option value="">Select Test Type</option>
                                        <option value="standard">Standard Screen</option>
                                        <option value="full">Full Panel</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                                {errors.testType && <span className="text-xs text-red-500 font-medium">{errors.testType.message}</span>}
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="text-[11px] font-bold text-veri5-teal uppercase tracking-widest">Test Result Image</label>
                                <div className="group border-2 border-dashed border-slate-200 rounded-2xl bg-slate-100/50 hover:bg-slate-100 hover:border-veri5-teal/40 transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px]">
                                    <UploadCloud className="w-10 h-10 text-veri5-teal mb-3 group-hover:scale-110 transition-transform" />
                                    <p className="text-sm font-bold text-slate-900 mb-1">Drag and drop or click to upload</p>
                                    <p className="text-[10px] text-xs font-bold text-veri5-teal/70 uppercase">PNG, JPG or PDF up to 10MB</p>
                                    <input type="file" className="hidden" {...register("file")} />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1 rounded-full h-12 border-slate-200 text-red-500 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 rounded-full h-12 bg-veri5-teal hover:bg-teal-600 text-white font-bold shadow-lg shadow-teal-500/20"
                                >
                                    Submit Result
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
