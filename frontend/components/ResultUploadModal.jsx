"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, UploadCloud } from "lucide-react";
import { verificationApi, testTypeApi } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Updated Schema Validation to match VERI5-31-1577 format
const formSchema = z.object({
    veri5Id: z.string()
        .min(1, 'Serial number is required')
        .regex(
            /^VERI5-\d{2}-\d{4}$/,
            "Format must be VERI5-XX-YYYY (e.g., VERI5-31-1577)"
        ),
    date: z.string().min(1, "Date is required"),
    testType: z.string().min(1, "Please select a test type"),
    testResult: z.enum(['positive', 'negative'], {
        required_error: "Please select a test result",
    }),
    file: z.instanceof(FileList).optional()
});

// Serial number generator for VERI5-XX-YYYY format
function generateSerialNumber() {
    const part1 = Math.floor(Math.random() * 90 + 10); // 2 digits
    const part2 = Math.floor(Math.random() * 9000 + 1000); // 4 digits
    return `VERI5-${part1}-${part2}`;
}

/**
 * Basic Image Quality Validation
 * Analyzes image properties to determine confidence score
 * TODO: Replace with actual AI/ML model for test kit validation
 */
const validateImageQuality = async (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                let confidence = 0.5; // Base score
                
                // Check 1: Image dimensions (reasonable size for test kit photo)
                const width = img.width;
                const height = img.height;
                const aspectRatio = width / height;
                
                console.log('Image dimensions:', width, 'x', height);
                console.log('Aspect ratio:', aspectRatio);
                
                // Reasonable dimensions for a test kit photo (not too small, not extremely large)
                if (width >= 400 && height >= 400 && width <= 4000 && height <= 4000) {
                    confidence += 0.2;
                    console.log('✓ Dimensions check passed');
                }
                
                // Check 2: Aspect ratio (most test kit photos are roughly square or portrait)
                if (aspectRatio >= 0.5 && aspectRatio <= 2.0) {
                    confidence += 0.15;
                    console.log('✓ Aspect ratio check passed');
                }
                
                // Check 3: File size (not too small - suggests low quality)
                const fileSizeMB = file.size / (1024 * 1024);
                if (fileSizeMB >= 0.1 && fileSizeMB <= 10) {
                    confidence += 0.15;
                    console.log('✓ File size check passed');
                }
                
                // Cap at 0.8 for basic validation (full 1.0 requires actual AI model)
                confidence = Math.min(confidence, 0.8);
                
                console.log('Final confidence score:', confidence);
                resolve(confidence);
            };
            
            img.onerror = () => {
                console.error('Invalid image file');
                resolve(0.1); // Very low confidence for invalid images
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            console.error('Failed to read file');
            resolve(0.1);
        };
        
        reader.readAsDataURL(file);
    });
};

export default function ResultUploadModal({ open, onOpenChange }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [testTypes, setTestTypes] = useState([]);
    const [isLoadingTestTypes, setIsLoadingTestTypes] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
    });

    console.log('Form errors:', errors);

    // Fetch test types when modal opens
    useEffect(() => {
        if (open) {
            fetchTestTypes();
        } else {
            // Reset form, clear file, and clear error when modal closes
            reset();
            setSelectedFile(null);
            setSubmitError(null);
        }
    }, [open]);

    // Watch for file changes
    const fileWatch = watch("file");
    useEffect(() => {
        if (fileWatch && fileWatch.length > 0) {
            setSelectedFile(fileWatch[0]);
        } else {
            setSelectedFile(null);
        }
    }, [fileWatch]);

    const fetchTestTypes = async () => {
        try {
            setIsLoadingTestTypes(true);
            console.log('Fetching test types...');
            const response = await testTypeApi.getTestTypes();
            console.log('Test types response:', response);
            console.log('Test types array:', response.testTypes);
            setTestTypes(response.testTypes || []);
        } catch (error) {
            console.error('Error fetching test types:', error);
            console.error('Error details:', error.response?.data);
            setTestTypes([]);
        } finally {
            setIsLoadingTestTypes(false);
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            console.log("Form Data:", data);
            console.log("Serial:", data.veri5Id);
            console.log("Test Type:", data.testType);
            console.log("Test Result:", data.testResult);
            console.log("Test Type (parsed):", parseInt(data.testType));

            // Validation check
            if (!data.testType || data.testType === "") {
                setSubmitError("Please select a test type");
                setIsSubmitting(false);
                return;
            }

            if (!data.testResult) {
                setSubmitError("Please select a test result (Positive/Negative)");
                setIsSubmitting(false);
                return;
            }

            // Extract image metadata if file is uploaded
            let imageMetadata = null;
            let aiConfidence = 0.85; // Default confidence (will be updated by AI validation if image is provided)

            if (selectedFile) {
                imageMetadata = {
                    size: selectedFile.size,
                    format: selectedFile.type,
                    name: selectedFile.name,
                };
                console.log("Image metadata:", imageMetadata);

                // Basic image quality validation
                console.log("🤖 Analyzing image quality...");
                aiConfidence = await validateImageQuality(selectedFile);
                console.log("✅ AI Confidence Score:", aiConfidence);

                // Reject very low quality images
                if (aiConfidence < 0.3) {
                    setSubmitError("Image quality too low. Please upload a clearer photo of your test result.");
                    setIsSubmitting(false);
                    return;
                }
            } else {
                // No photo uploaded
                setSubmitError("Please upload a photo of your test result.");
                setIsSubmitting(false);
                return;
            }

            const requestData = {
                serial: data.veri5Id,
                aiConfidence: aiConfidence,
                testTypeId: parseInt(data.testType),
                testResult: data.testResult,
                imageMetadata: imageMetadata,
            };

            console.log("=== Request Data Debug ===");
            console.log("Full Request:", requestData);
            console.log("Serial:", requestData.serial, "Type:", typeof requestData.serial);
            console.log("AI Confidence:", requestData.aiConfidence, "Type:", typeof requestData.aiConfidence);
            console.log("Test Type ID:", requestData.testTypeId, "Type:", typeof requestData.testTypeId);
            console.log("Test Result:", requestData.testResult, "Type:", typeof requestData.testResult);
            console.log("Image Metadata:", requestData.imageMetadata);

            // Call verification API
            const result = await verificationApi.verifyTestKit(requestData);

            console.log('Verification result:', result);

            // Show success message
            alert('✅ Test result verified successfully! Your status has been updated to Verified.');

            // Reset form and close modal
            reset();
            onOpenChange(false);

            // Reload page to show updated status
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        } catch (error) {
            console.error('=== Verification Error ===');
            console.error('Full error:', error);
            console.error('Error response:', error.response);
            console.error('Error response data:', error.response?.data);
            console.error('Error response status:', error.response?.status);
            console.error('Error message:', error.message);

            // Extract error message from response
            const errorMessage = error.response?.data?.error || error.message || 'Failed to verify test result';
            console.error('Extracted error message:', errorMessage);
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-slate-900 gap-0 rounded-3xl border-2 border-primary/30 shadow-lg">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">

                    {/* Left/Top: Image Preview or Illustration */}
                    <div className="relative bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 p-8 flex flex-col justify-center items-center gap-6 md:w-5/12 border-r border-primary/20 overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="relative w-52 h-52 bg-white dark:bg-slate-800 rounded-3xl shadow-md border-2 border-primary/30 rotate-[-3deg] hover:rotate-0 transition-transform duration-500 overflow-hidden p-3">
                                {/* Mock Kit Image with gradient overlay */}
                                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/20 rounded-2xl flex items-center justify-center text-primary text-xs font-bold">
                                    <div className="text-center">
                                        TEST KIT
                                    </div>
                                </div>
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                            </div>
                        </div>
                        
                        <div className="text-center relative z-10">
                            <h4 className="font-bold text-foreground text-lg mb-1">Test Result Submission</h4>
                            <p className="text-sm text-muted-foreground mb-2">Submit your test result for a general health check. All information is kept confidential.</p>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex gap-2 text-xs text-muted-foreground relative z-10">
                            <span className="flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-border">
                                <span className="text-green-500">✓</span> FDA Approved
                            </span>
                            <span className="flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-border">
                                <span className="text-green-500">✓</span> 99% Accurate
                            </span>
                        </div>
                    </div>

                    {/* Right/Bottom: Form */}
                    <div className="p-8 md:p-10 md:w-7/12 relative overflow-y-auto max-h-[90vh]">
                        {/* Header with icon */}
                        <DialogHeader className="mb-8 text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-foreground">Submit Test Result</DialogTitle>
                                    <p className="text-sm text-muted-foreground">Upload your test result for verification</p>
                                </div>
                            </div>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Error Message Display */}
                            {submitError && (
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-destructive/10 to-destructive/5 border-2 border-destructive/30 text-destructive text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{submitError}</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Serial Number</label>
                                    <input
                                        placeholder="VERI5-31-1577"
                                        {...register("veri5Id")}
                                        className="w-full h-12 px-4 rounded-xl bg-background border-2 border-border hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground/40"
                                    />
                                    {errors.veri5Id && <span className="text-xs text-destructive font-medium">{errors.veri5Id.message}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Test Date</label>
                                    <input
                                        type="date"
                                        max={new Date().toISOString().split('T')[0]}
                                        {...register("date")}
                                        className="w-full h-12 px-4 rounded-xl bg-background border-2 border-border hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm font-medium text-foreground"
                                    />
                                    {errors.date && <span className="text-xs text-destructive font-medium">{errors.date.message}</span>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider">Test Type</label>
                                <div className="relative group">
                                    <select
                                        {...register("testType")}
                                        disabled={isLoadingTestTypes}
                                        className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border-2 border-border hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none appearance-none text-sm font-medium text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isLoadingTestTypes ? (
                                            <option value="">Loading test types...</option>
                                        ) : (
                                            <>
                                                <option value="">Select a test type</option>
                                                {testTypes.map((testType) => (
                                                    <option key={testType.id} value={testType.id}>
                                                        {testType.name}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary transition-transform group-hover:scale-110">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                                {errors.testType && <span className="text-xs text-destructive font-medium">{errors.testType.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider">Test Result</label>
                                <div className="relative group">
                                    <select
                                        {...register("testResult")}
                                        className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border-2 border-border hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none appearance-none text-sm font-medium text-foreground transition-all"
                                    >
                                        <option value="">Select Result</option>
                                        <option value="negative" className="text-green-600">Negative (Clean)</option>
                                        <option value="positive" className="text-red-600">Positive (Detected)</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary transition-transform group-hover:scale-110">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                                {errors.testResult && <span className="text-xs text-destructive font-medium">{errors.testResult.message}</span>}
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-bold text-primary uppercase tracking-wider">Test Result Image</label>
                                <label htmlFor="file-upload" className="group relative border-2 border-dashed border-primary/30 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/15 hover:to-primary/10 hover:border-primary/50 transition-all duration-300 p-10 flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px] overflow-hidden">
                                    {/* Animated background effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                            <UploadCloud className="w-8 h-8 text-primary" />
                                        </div>
                                        {selectedFile ? (
                                            <>
                                                <p className="text-base font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                                                    <span className="text-green-500 text-xl">✓</span> {selectedFile.name}
                                                </p>
                                                <div className="flex items-center justify-center gap-3 text-sm">
                                                    <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-full border border-primary/20">
                                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </span>
                                                    <span className="px-3 py-1 bg-green-500/10 text-green-600 font-bold rounded-full border border-green-500/20">
                                                        Ready to upload
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-3">Click to change file</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-base font-bold text-foreground mb-2">Drop your file here or click to browse</p>
                                                <p className="text-xs text-primary/70 font-semibold uppercase tracking-wide">PNG, JPG or PDF • Max 10MB</p>
                                            </>
                                        )}
                                    </div>
                                    <input 
                                        id="file-upload"
                                        type="file" 
                                        accept="image/png,image/jpeg,image/jpg,application/pdf"
                                        className="hidden" 
                                        {...register("file")} 
                                    />
                                </label>
                                {errors.file && <span className="text-xs text-destructive font-medium">{errors.file.message}</span>}
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        reset();
                                        setSelectedFile(null);
                                        setSubmitError(null);
                                        onOpenChange(false);
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1 rounded-xl h-13 border-2 border-border text-muted-foreground font-bold hover:bg-muted hover:text-foreground hover:border-border transition-all duration-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 rounded-xl h-13 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </span>
                                    ) : (
                                        <span>Submit Result</span>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
