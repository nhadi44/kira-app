"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  FileSearch, 
  Binary, 
  Fingerprint, 
  Zap, 
  Activity,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

type AuditStatus = 
  | "PENDING" | "QUEUED" | "EXTRACTING" | "ANALYZING" 
  | "CORRELATING" | "GENERATING_TESTS" | "VALIDATING" 
  | "FINALIZING" | "COMPLETED" | "FAILED";

interface ScanState {
  status: AuditStatus;
  progress: number;
  currentStage: string;
  projectName: string;
  errorMessage?: string;
}

export default function ScanProgressPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [state, setState] = useState<ScanState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state && state.status !== "COMPLETED" && state.status !== "FAILED") {
        e.preventDefault();
        e.returnValue = "Security scan is still running in the background. Your audit will continue processing even if you leave this page.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/audit/${id}/status`);
        if (!response.ok) throw new Error("Failed to fetch scan status");
        
        const data = await response.json();
        console.log(`[SCAN_POLL] Received status:`, data);
        setState(data);

        if (data.status === "COMPLETED") {
          setTimeout(() => router.push(`/dashboard/report/${id}`), 1500);
          clearInterval(pollInterval);
        } else if (data.status === "FAILED") {
          const errMsg = data.errorMessage || "Security analysis engine encountered a protocol error.";
          console.error(`[SCAN_FAILED] Audit ${id} failed:`, errMsg);
          setError(errMsg);
          clearInterval(pollInterval);
        }
      } catch (e: any) {
        console.error(`[SCAN_ERROR] Error polling audit ${id}:`, e);
        setError(e.message);
        clearInterval(pollInterval);
      }
    };

    fetchStatus();
    pollInterval = setInterval(fetchStatus, 3000);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id, router, state?.status]);

  if (error) {
    const isQuotaError = error.includes("429") || error.includes("quota") || error.includes("Too Many Requests");

    return (
      <div className="max-w-2xl mx-auto py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-1 bg-gradient-to-b from-rose-500/20 to-transparent rounded-[2.5rem]"
        >
          <div className="bg-zinc-950 border border-rose-500/20 rounded-[2.4rem] p-10 space-y-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 blur-[100px]" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl relative">
                <ShieldAlert className="text-rose-500" size={40} />
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Intelligence Interruption</h2>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                  The security analysis engine encountered a protocol anomaly during the audit process.
                </p>
              </div>

              {isQuotaError ? (
                <div className="w-full p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-3 text-left">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-widest">
                    <Zap size={14} className="fill-amber-500" /> API Quota Exhausted
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    KIRA is currently using the <span className="text-amber-200/80">Gemini Free Tier</span>. 
                    Your audit requires more tokens than the current minute allows. 
                    The background engine will automatically retry, but you can also try again in 30-60 seconds.
                  </p>
                </div>
              ) : (
                <div className="w-full p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-left overflow-hidden">
                  <p className="text-xs text-zinc-400 leading-relaxed font-mono break-all">
                    {error.length > 300 ? error.substring(0, 300) + "..." : error}
                  </p>
                </div>
              )}

              <div className="flex w-full gap-3">
                <button 
                  onClick={() => router.push("/dashboard/new-scan")}
                  className="flex-1 px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-2xl font-bold transition-all text-sm"
                >
                  Return to Intake
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="flex-1 px-6 py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold transition-all text-sm shadow-xl shadow-white/5"
                >
                  Retry Analysis
                </button>
              </div>

              <details className="w-full text-left">
                <summary className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest cursor-pointer hover:text-zinc-400 transition-colors list-none flex items-center gap-2">
                  <ChevronRight size={12} /> View Raw Protocol Error
                </summary>
                <div className="mt-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50 overflow-hidden">
                  <pre className="text-[9px] text-zinc-600 whitespace-pre-wrap font-mono leading-tight break-all">
                    {error}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!state) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
          <Activity size={12} className="animate-pulse" /> Active Analysis Node
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Auditing <span className="text-blue-400">{state.projectName}</span>
        </h1>
        <p className="text-zinc-500">
          KIRA is performing a deep intelligence audit in an isolated environment.
        </p>
      </div>

      {/* Main Progress Card */}
      <div className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <Shield size={200} />
        </div>

        <div className="relative z-10 space-y-10">
          {/* Progress Circle/Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-zinc-500">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                {state.currentStage}
              </div>
              <span className="text-white">{state.progress}%</span>
            </div>
            <div className="h-4 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-1">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${state.progress}%` }}
                transition={{ type: "spring", damping: 20, stiffness: 50 }}
              />
            </div>
          </div>

          {/* Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StageItem 
              label="Intake & Extraction" 
              active={state.status === "EXTRACTING"} 
              completed={["ANALYZING", "CORRELATING", "GENERATING_TESTS", "VALIDATING", "FINALIZING", "COMPLETED"].includes(state.status)}
              icon={<Binary size={18} />}
            />
            <StageItem 
              label="Security Analysis" 
              active={state.status === "ANALYZING"} 
              completed={["CORRELATING", "GENERATING_TESTS", "VALIDATING", "FINALIZING", "COMPLETED"].includes(state.status)}
              icon={<FileSearch size={18} />}
            />
            <StageItem 
              label="Vulnerability Correlation" 
              active={state.status === "CORRELATING"} 
              completed={["GENERATING_TESTS", "VALIDATING", "FINALIZING", "COMPLETED"].includes(state.status)}
              icon={<Fingerprint size={18} />}
            />
            <StageItem 
              label="Intelligence Assembly" 
              active={["GENERATING_TESTS", "VALIDATING", "FINALIZING"].includes(state.status)} 
              completed={state.status === "COMPLETED"}
              icon={<Zap size={18} />}
            />
          </div>

          {/* Reassurance */}
          <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex gap-4">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl h-fit">
              <Lock className="text-emerald-500" size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Background Orchestration</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Your scan continues securely in the background. You may safely leave this page; we'll finalize the report and store it in your ledger.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Log */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest ml-4">System Event Log</h3>
        <div className="space-y-2">
          <LogItem time="0s" event="Audit pipeline initialized" done />
          <LogItem time="2s" event="Project archive verified and extracted" done={state.progress > 10} />
          <LogItem time="5s" event="Deep intelligence analysis started" done={state.progress > 30} />
          {state.progress > 80 && <LogItem time="~" event="Security validation tests generated" done />}
        </div>
      </div>
    </div>
  );
}

function StageItem({ label, active, completed, icon }: { label: string, active: boolean, completed: boolean, icon: React.ReactNode }) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all flex items-center gap-3",
      active ? "bg-blue-500/5 border-blue-500/20 text-blue-400" : 
      completed ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : 
      "bg-zinc-950 border-zinc-800 text-zinc-600"
    )}>
      <div className={cn(
        "p-2 rounded-lg border",
        active ? "bg-blue-500/10 border-blue-500/20" : 
        completed ? "bg-emerald-500/10 border-emerald-500/20" : 
        "bg-zinc-900 border-zinc-800"
      )}>
        {completed ? <CheckCircle2 size={18} /> : icon}
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      {active && <Loader2 size={14} className="ml-auto animate-spin" />}
    </div>
  );
}

function LogItem({ time, event, done }: { time: string, event: string, done: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-4 px-4 py-2 rounded-xl text-[10px] font-mono",
      done ? "text-zinc-400" : "text-zinc-600"
    )}>
      <span className="w-12 text-zinc-700">{time}</span>
      <ChevronRight size={10} className={done ? "text-emerald-500" : "text-zinc-800"} />
      <span className={cn(done ? "text-zinc-300" : "text-zinc-600")}>{event}</span>
      {done && <CheckCircle2 size={10} className="ml-auto text-emerald-500/30" />}
    </div>
  );
}
