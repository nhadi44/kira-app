import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  FileText, 
  ChevronRight, 
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Activity
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function LedgerPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const audits = await prisma.audit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Audit Ledger</h1>
          <p className="text-zinc-400 text-sm">Historical record of all security scan sessions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              placeholder="Search projects..."
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/50">
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Project Name</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Score</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Created At</th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {audits.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-zinc-500">
                  <FileText className="mx-auto mb-4 opacity-20" size={48} />
                  No audit history found.
                </td>
              </tr>
            ) : (
              audits.map((audit) => (
                <tr key={audit.id} className="group hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {audit.projectName}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600 mt-0.5">{audit.id}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "font-mono font-bold px-2 py-1 rounded text-xs",
                      audit.score > 80 ? "bg-emerald-500/10 text-emerald-500" :
                      audit.score > 50 ? "bg-amber-500/10 text-amber-500" :
                      "bg-rose-500/10 text-rose-500"
                    )}>
                      {audit.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        audit.status === "COMPLETED" ? "bg-emerald-500" :
                        audit.status === "FAILED" ? "bg-rose-500" :
                        "bg-amber-500 animate-pulse"
                      )} />
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {audit.status}
                        </span>
                        {["QUEUED", "EXTRACTING", "ANALYZING", "CORRELATING", "GENERATING_TESTS", "VALIDATING", "FINALIZING"].includes(audit.status) && (
                          <span className="text-[10px] text-zinc-600 font-mono mt-0.5">{audit.progress}%</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">
                    {new Date(audit.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {audit.status === "COMPLETED" ? (
                        <Link 
                          href={`/dashboard/report/${audit.id}`}
                          className="p-2 text-zinc-500 hover:text-white transition-colors"
                          title="View Report"
                        >
                          <ExternalLink size={16} />
                        </Link>
                      ) : (
                        <Link 
                          href={`/dashboard/scan/${audit.id}`}
                          className="p-2 text-zinc-500 hover:text-white transition-colors"
                          title="View Progress"
                        >
                          <Activity size={16} className="text-amber-500" />
                        </Link>
                      )}
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
