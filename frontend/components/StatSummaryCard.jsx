export default function StatSummaryCard({ label, value, subtext, indicatorColor }) {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-300 hover:border-emerald-500 shadow-lg transition-all group flex flex-col justify-between h-full">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
                <div className="flex items-center gap-3">
                    {indicatorColor && (
                        <span className={`w-3 h-3 rounded-full ${indicatorColor}`} />
                    )}
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                </div>
            </div>
            {subtext && <p className="text-xs text-slate-500 mt-4 font-medium">{subtext}</p>}
        </div>
    );
}
