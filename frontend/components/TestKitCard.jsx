import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function TestKitCard({ title, description, price, features = [], badge, imageSrc, onOrder }) {
    return (
        <div className="bg-card rounded-3xl p-7 border border-border hover:border-primary shadow-lg hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full relative overflow-hidden group w-full max-w-sm">

            {/* Product Image Area Placeholder */}
            <div className="w-full aspect-[4/3] bg-muted/30 rounded-2xl mb-7 relative overflow-hidden flex items-center justify-center">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <span className="text-muted-foreground/30 text-sm uppercase font-bold tracking-widest">Image Placeholder</span>
                )}

                {badge && (
                    <div className="absolute top-3 right-3 bg-yellow-100/80 backdrop-blur-sm text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-md uppercase border border-yellow-200">
                        {badge}
                    </div>
                )}
            </div>

            <div className="flex-grow">
                <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-5 font-medium">{features[0] || 'Medical Grade Testing'}</p>

                <div className="flex items-baseline gap-1 mb-7">
                    <span className="text-3xl font-bold text-foreground">Rs. {price}</span>
                </div>
            </div>

            <Button
                onClick={onOrder}
                className="w-full bg-veri5-teal hover:bg-teal-600/90 text-white rounded-xl h-11 font-bold shadow-md shadow-teal-500/10 active:scale-[0.98] transition-all"
            >
                Order Now
            </Button>
        </div>
    );
}
