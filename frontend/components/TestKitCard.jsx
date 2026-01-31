import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function TestKitCard({ title, description, price, features = [], badge, imageSrc }) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-300 hover:border-emerald-500 shadow-lg hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full relative overflow-hidden group">

            {/* Product Image Area Placeholder */}
            <div className="w-full aspect-[4/3] bg-slate-50 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <span className="text-slate-300 text-xs uppercase font-bold tracking-widest">Image Placeholder</span>
                )}

                {badge && (
                    <div className="absolute top-3 right-3 bg-yellow-100/80 backdrop-blur-sm text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-md uppercase border border-yellow-200">
                        {badge}
                    </div>
                )}
            </div>

            <div className="flex-grow">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
                <p className="text-xs text-slate-400 mb-4 font-medium uppercase tracking-wide">{features[0] || 'Medical Grade Testing'}</p>

                <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-bold text-slate-900">Rs. {price}</span>
                </div>
            </div>

            <Button className="w-full bg-veri5-teal hover:bg-teal-600/90 text-white rounded-xl h-10 font-bold shadow-md shadow-teal-500/10 active:scale-[0.98] transition-all">
                Order Now
            </Button>
        </div>
    );
}
