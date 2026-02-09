"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShoppingBag, MapPin, Loader2, CheckCircle, Minus, Plus, Banknote, AlertCircle } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { orderApi } from "@/lib/api";

// Schema Validation
const formSchema = z.object({
    address: z.string().min(10, "Delivery address is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
});

export default function OrderModal({ open, onOpenChange, testKit }) {
    const [step, setStep] = useState('form'); // form, processing, success, error
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const [orderResult, setOrderResult] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1,
        }
    });

    // Update form value when quantity changes
    useEffect(() => {
        setValue('quantity', quantity);
    }, [quantity, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        setStep('processing');
        setError(null);
        
        try {
            // Call the API to create the order
            const response = await orderApi.createOrder({
                deliveryAddress: data.address,
                items: [{
                    testKitId: testKit.id,
                    qty: quantity,
                    unitPriceCents: testKit.priceCents,
                }],
            });

            if (response.success) {
                setOrderResult(response.data);
                setStep('success');
            } else {
                throw new Error(response.error || 'Failed to place order');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            setError(err.response?.data?.error || err.message || 'Failed to place order. Please try again.');
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setStep('form');
        setQuantity(1);
        setError(null);
        setOrderResult(null);
        onOpenChange(false);
    };

    const handleRetry = () => {
        setStep('form');
        setError(null);
    };

    const formatPrice = (priceCents) => {
        if (!priceCents || priceCents === 0) return 'Free';
        return (priceCents / 100).toFixed(0);
    };

    const calculateTotal = () => {
        if (!testKit?.priceCents) return 0;
        return (testKit.priceCents * quantity) / 100;
    };

    const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
    const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

    if (!testKit) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white gap-0 rounded-3xl border-0 shadow-2xl">
                <div className="flex flex-col md:flex-row h-full">

                    {/* Left: Product Preview */}
                    <div className="bg-slate-50 p-8 flex flex-col justify-center items-center gap-4 md:w-5/12 border-r border-slate-100/50">
                        <div className="relative w-48 h-48 bg-white rounded-2xl shadow-sm border border-slate-200 rotate-[-3deg] overflow-hidden">
                            {testKit.imageSrc ? (
                                <Image
                                    src={testKit.imageSrc}
                                    alt={testKit.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-[10px]">
                                    KIT PREVIEW
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h4 className="font-bold text-slate-800">{testKit.name}</h4>
                            <p className="text-xs text-slate-500">{testKit.description || 'STI screening test'}</p>
                            <p className="mt-2 font-bold text-slate-900 text-lg">Rs. {formatPrice(testKit.priceCents)} / unit</p>
                        </div>

                        {step === 'form' && (
                            <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200 w-full">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <ShoppingBag className="w-4 h-4 text-veri5-teal" />
                                    <span>Free delivery within Colombo</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Form / Status */}
                    <div className="p-8 md:p-10 md:w-7/12 relative">

                        {step === 'form' && (
                            <>
                                <DialogHeader className="mb-6 text-left">
                                    <DialogTitle className="text-xl font-bold text-slate-800">Place Your Order</DialogTitle>
                                    <p className="text-sm text-slate-500 mt-1">Enter your delivery details below</p>
                                </DialogHeader>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Quantity Selector */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-veri5-teal uppercase tracking-widest">Quantity</label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={decrementQuantity}
                                                    className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 h-12 flex items-center justify-center font-bold text-slate-800 border-x-2 border-slate-200">
                                                    {quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={incrementQuantity}
                                                    className="w-12 h-12 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <span className="text-sm text-slate-500">Max 10 units per order</span>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-veri5-teal uppercase tracking-widest">Delivery Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                                            <textarea
                                                placeholder="123 Main Street, Colombo 03"
                                                {...register("address")}
                                                rows={3}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-300 resize-none"
                                            />
                                        </div>
                                        {errors.address && <span className="text-xs text-red-500 font-medium">{errors.address.message}</span>}
                                    </div>

                                    {/* Payment Method */}
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-veri5-teal uppercase tracking-widest">Payment Method</label>
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                                            <div className="w-10 h-10 bg-veri5-teal/10 rounded-lg flex items-center justify-center">
                                                <Banknote className="w-5 h-5 text-veri5-teal" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">Cash on Delivery</p>
                                                <p className="text-xs text-slate-500">Pay when you receive your order</p>
                                            </div>
                                            <div className="ml-auto">
                                                <div className="w-5 h-5 rounded-full border-2 border-veri5-teal flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-veri5-teal"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-slate-500">Unit Price</span>
                                            <span className="text-sm text-slate-600">Rs. {formatPrice(testKit.priceCents)}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-slate-500">Quantity</span>
                                            <span className="text-sm text-slate-600">x {quantity}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-4 pt-2 border-t border-dashed border-slate-200">
                                            <span className="text-sm font-semibold text-slate-700">Total Amount</span>
                                            <span className="text-xl font-bold text-slate-900">Rs. {calculateTotal()}</span>
                                        </div>
                                        <Button 
                                            type="submit"
                                            className="w-full bg-veri5-teal hover:bg-teal-600 text-white rounded-xl h-12 font-bold shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all"
                                        >
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Confirm Order
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}

                        {step === 'processing' && (
                            <div className="flex flex-col items-center justify-center h-full py-12 animate-in fade-in duration-300">
                                <div className="w-16 h-16 bg-veri5-teal/10 rounded-full flex items-center justify-center mb-6">
                                    <Loader2 className="w-8 h-8 text-veri5-teal animate-spin" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Processing Order</h3>
                                <p className="text-sm text-slate-500 text-center">Please wait while we confirm your order...</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="flex flex-col items-center justify-center h-full py-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Order Placed!</h3>
                                <p className="text-sm text-slate-500 text-center mb-2">Your {quantity} test kit{quantity > 1 ? 's' : ''} will be delivered within 2-3 business days.</p>
                                {orderResult?.id && (
                                    <p className="text-xs text-slate-400 mb-2">Order ID: #{orderResult.id.slice(0, 8)}</p>
                                )}
                                <p className="text-lg font-bold text-slate-800 mb-6">Total: Rs. {calculateTotal()}</p>
                                <p className="text-xs text-slate-400 text-center mb-8">You will receive an SMS confirmation shortly.</p>
                                <Button 
                                    onClick={handleClose}
                                    className="bg-veri5-teal hover:bg-teal-600 text-white rounded-xl h-12 px-8 font-bold"
                                >
                                    Done
                                </Button>
                            </div>
                        )}

                        {step === 'error' && (
                            <div className="flex flex-col items-center justify-center h-full py-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Order Failed</h3>
                                <p className="text-sm text-red-500 text-center mb-6">{error}</p>
                                <div className="flex gap-3">
                                    <Button 
                                        onClick={handleRetry}
                                        className="bg-veri5-teal hover:bg-teal-600 text-white rounded-xl h-12 px-8 font-bold"
                                    >
                                        Try Again
                                    </Button>
                                    <Button 
                                        onClick={handleClose}
                                        variant="outline"
                                        className="rounded-xl h-12 px-8 font-bold border-2"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
