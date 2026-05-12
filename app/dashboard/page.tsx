import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const audits = await prisma.audit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const totalScans = await prisma.audit.count({ where: { userId } });
  const avgScore = await prisma.audit.aggregate({
    where: { userId, status: "COMPLETED" },
    _avg: { score: true },
  });

  const stats = [
    { label: "Total Scan Sessions", value: totalScans, icon: Shield, color: "text-blue-500" },
    { label: "Average Integrity", value: Math.round(avgScore._avg.score || 0) + "%", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Pending Analysis", value: "0", icon: Clock, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Security Overview</h1>
        <p className="text-zinc-400 text-sm">Real-time posture analysis and threat intelligence metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center gap-4">
            <div className={cn("p-3 bg-zinc-950 border border-zinc-800 rounded-lg", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-mono font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Recent Scan Sessions</h3>
          <Link href="/dashboard/ledger" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 uppercase tracking-widest transition-colors">
            View All <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {audits.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              <p>No recent activity detected. Initiate a new scan to begin.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {audits.map((audit) => (
                <div key={audit.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      audit.score > 80 ? "bg-emerald-500" : audit.score > 50 ? "bg-amber-500" : "bg-rose-500"
                    )} />
                    <div>
                      <p className="font-semibold text-white text-sm">{audit.projectName}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{new Date(audit.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs font-bold text-zinc-400 uppercase">Score</p>
                      <p className={cn(
                        "text-sm font-mono font-bold",
                        audit.score > 80 ? "text-emerald-500" : audit.score > 50 ? "text-amber-500" : "text-rose-500"
                      )}>{audit.score}</p>
                    </div>
                    <Link 
                      href={`/dashboard/report/${audit.id}`}
                      className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-gradient-to-br from-emerald-600/20 to-zinc-900 border border-emerald-500/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Ready for a new security audit?</h3>
          <p className="text-zinc-400 text-sm max-w-md">Identify exposures and strengthen your codebase with our AI-powered deep scan engine.</p>
        </div>
        <Link 
          href="/dashboard/new-scan"
          className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold transition-all active:scale-95"
        >
          Initiate Deep Scan
        </Link>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
