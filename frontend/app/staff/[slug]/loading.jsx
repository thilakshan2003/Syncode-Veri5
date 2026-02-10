export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0F172A] p-8 max-w-[1600px] mx-auto space-y-8 animate-pulse">
            <div className="flex justify-between">
                <div className="space-y-4">
                    <div className="h-10 w-64 bg-slate-800 rounded-xl"></div>
                    <div className="h-4 w-48 bg-slate-800 rounded-lg"></div>
                </div>
                <div className="h-14 w-96 bg-slate-800 rounded-2xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-slate-800 rounded-[2rem] border border-slate-700/30"></div>
                ))}
            </div>

            <div className="h-[500px] bg-slate-800 rounded-[2rem] border border-slate-700/30"></div>
        </div>
    );
}
