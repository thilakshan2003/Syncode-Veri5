export default function ResourceSkeleton() {
    return (
        <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm animate-pulse flex flex-col h-full">
            {/* Image Skeleton */}
            <div className="h-48 bg-muted"></div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-4 flex-grow">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-16 bg-muted rounded-full"></div>
                    <div className="h-3 w-12 bg-muted/50 rounded"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-5 w-full bg-muted rounded"></div>
                    <div className="h-5 w-2/3 bg-muted rounded"></div>
                </div>

                <div className="space-y-2 pt-2">
                    <div className="h-3 w-full bg-muted/50 rounded"></div>
                    <div className="h-3 w-full bg-muted/50 rounded"></div>
                </div>

                <div className="pt-4 border-t border-border mt-auto">
                    <div className="h-3 w-20 bg-muted/50 rounded"></div>
                </div>
            </div>
        </div>
    );
}

export function ResourceGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <ResourceSkeleton key={i} />
            ))}
        </div>
    );
}
