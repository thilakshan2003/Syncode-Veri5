import Link from 'next/link';
import { Button as ShadcnButton } from '@/components/ui/button';

export default function Button({ variant = 'primary', href, children, className, ...props }) {
    const mapVariant = (v) => {
        if (v === 'primary') return 'default';
        return v;
    };

    const finalVariant = mapVariant(variant);

    if (href) {
        return (
            <ShadcnButton variant={finalVariant} className={className} asChild {...props}>
                <Link href={href}>
                    {children}
                </Link>
            </ShadcnButton>
        );
    }

    return (
        <ShadcnButton variant={finalVariant} className={className} {...props}>
            {children}
        </ShadcnButton>
    );
}
