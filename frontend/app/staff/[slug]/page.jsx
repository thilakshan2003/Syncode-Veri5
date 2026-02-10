import { getDashboardData, updateTestStatus } from "./actions";
import {
    Activity,
    CheckCircle2,
    Clock,
    Search,
    Upload,
    User,
    MoreVertical,
    Filter,
    ArrowUpRight,
    RefreshCw
} from "lucide-react";
import SubmissionTable from "./SubmissionTable";

export default async function ClinicalDashboard({ params }) {
    const { slug } = await params;
    const data = await getDashboardData(slug);

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
            {/* Sidebar/Navigation would go here, but for this task we focus on the dashboard */}

            <main className="p-8 max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{data.clinicName}</h1>
                        <p className="text-slate-400 mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
                            Live Lab Management Systems
                        </p>
                    </div>

                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#10B981] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Patient UUID..."
                            className="w-full bg-[#1E293B] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 transition-all"
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Pending Uploads"
                        value={data.stats.pending}
                        icon={<Clock className="w-6 h-6 text-amber-500" />}
                        bgColor="bg-amber-500/10"
                        borderColor="border-amber-500/20"
                        trend="+3 since last hour"
                    />
                    <StatCard
                        title="Verified Today"
                        value={data.stats.verifiedToday}
                        icon={<CheckCircle2 className="w-6 h-6 text-[#10B981]" />}
                        bgColor="bg-[#10B981]/10"
                        borderColor="border-[#10B981]/20"
                        trend="15% above average"
                    />
                    <StatCard
                        title="Avg. Turnaround"
                        value={data.stats.avgTurnaround}
                        icon={<Activity className="w-6 h-6 text-[#2563EB]" />}
                        bgColor="bg-[#2563EB]/10"
                        borderColor="border-[#2563EB]/20"
                        trend="On track"
                    />
                </div>

                {/* Submissions Section */}
                <div className="bg-[#1E293B] border border-slate-800 rounded-[2rem] overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-white">Recent Lab Submissions</h2>
                            <span className="bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Real-time</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                                <Filter className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <SubmissionTable initialSubmissions={data.submissions} />
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, bgColor, borderColor, trend }) {
    return (
        <div className={`p-6 rounded-[2rem] border ${borderColor} ${bgColor} flex items-start justify-between group hover:scale-[1.02] transition-transform duration-300 cursor-default`}>
            <div>
                <p className="text-sm font-semibold text-slate-400 mb-1">{title}</p>
                <h3 className="text-4xl font-bold text-white mb-4">{value}</h3>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    <ArrowUpRight className="w-3 h-3" />
                    {trend}
                </div>
            </div>
            <div className={`p-4 rounded-2xl bg-white/5 shadow-inner`}>
                {icon}
            </div>
        </div>
    );
}
