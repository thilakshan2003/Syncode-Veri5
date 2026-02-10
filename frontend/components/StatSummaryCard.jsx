export default function StatSummaryCard({ label, value, subtext, indicatorColor }) {
    return (
        <div className="bg-card rounded-3xl p-6 border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full">
            <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
                <div className="flex items-center gap-3">
                    {indicatorColor && (
                        <span className={`w-3 h-3 rounded-full ${indicatorColor}`} />
                    )}
                    <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                </div>
            </div>
            {subtext && <p className="text-xs text-muted-foreground mt-4 font-medium">{subtext}</p>}
        </div>
    );
}
