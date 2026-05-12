"use client";

import { useState, useEffect } from "react";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Download, 
  ChevronRight, 
  Code2,
  BookOpen,
  Briefcase,
  AlertTriangle,
  Clock,
  FileSearch,
  CheckCircle2,
  ArrowRight,
  Zap,
  Activity,
  Target,
  Lock,
  UserCheck,
  Server,
  Package,
  Layers,
  History,
  Eye,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuditFinding, SeverityLevel } from "@/lib/validations/audit";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFReport } from "@/components/dashboard/PDFReport";
import { VulnerabilityGraph } from "@/components/dashboard/VulnerabilityGraph";
import { cn } from "@/lib/utils";

interface ReportClientProps {
  audit: {
    id: string;
    projectName: string;
    score: number;
    executiveSummary?: string;
    findings: AuditFinding[];
    status: string;
    createdAt: Date;
    metadata?: any;
  };
}

const getPosture = (score: number) => {
  if (score >= 90) return { label: "Hardened", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
  if (score >= 80) return { label: "Secure", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
  if (score >= 50) return { label: "Moderate Risk", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  if (score >= 30) return { label: "At Risk", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" };
  return { label: "Compromised", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
};

type TabType = "developer" | "beginner" | "business" | "validation";

export function ReportClient({ audit }: ReportClientProps) {
  const [activeFinding, setActiveFinding] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TabType>("developer");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const findings = audit.findings || [];
  const currentFinding = findings[activeFinding];

  const getSeverityStyles = (severity: SeverityLevel) => {
    switch (severity) {
      case "Critical": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "High": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Low": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const scoreColor = audit.score > 80 ? "text-emerald-500" : audit.score > 50 ? "text-amber-500" : "text-rose-500";
  const posture = getPosture(audit.score);

  const categories = [
    { id: "Authentication", icon: Lock, color: "text-blue-500" },
    { id: "Infrastructure", icon: Server, color: "text-purple-500" },
    { id: "Dependency", icon: Package, color: "text-amber-500" },
    { id: "PII Exposure", icon: UserCheck, color: "text-emerald-500" },
    { id: "Access Control", icon: Shield, color: "text-rose-500" },
    { id: "Configuration", icon: Activity, color: "text-zinc-400" },
  ];

  const getCategoryStats = (catId: string) => {
    const catFindings = findings.filter(f => f.category === catId);
    return {
      count: catFindings.length,
      critical: catFindings.filter(f => f.severity === "Critical").length,
      high: catFindings.filter(f => f.severity === "High").length
    };
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">{audit.projectName}</h1>
            <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Project Audit
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(audit.createdAt).toLocaleDateString()}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span className="flex items-center gap-1.5"><FileSearch size={14} /> {audit.metadata?.filesScanned || 1} files scanned</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={cn("px-4 py-2 rounded-xl border flex items-center gap-2.5", posture.bg, posture.border)}>
            <div className={cn("w-2 h-2 rounded-full animate-pulse", posture.color.replace("text-", "bg-"))} />
            <span className={cn("text-sm font-bold uppercase tracking-widest", posture.color)}>{posture.label}</span>
          </div>
          {isMounted && (
            <PDFDownloadLink
              document={<PDFReport audit={audit as any} findings={audit.findings} />}
              fileName={`KIRA-Report-${audit.projectName}.pdf`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-bold hover:bg-zinc-800 transition-all"
            >
              {({ loading }) => (
                <>
                  <Download size={18} />
                  <span>{loading ? "Preparing..." : "Export PDF"}</span>
                </>
              )}
            </PDFDownloadLink>
          )}
          <button className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all">
            <ShieldCheck size={20} />
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      {audit.executiveSummary && (
        <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <FileText size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Executive Summary</h3>
            </div>
            <p className="text-xl text-zinc-300 leading-relaxed max-w-4xl font-medium">
              &quot;{audit.executiveSummary}&quot;
            </p>
          </div>
        </div>
      )}

      {/* Attack Surface Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const stats = getCategoryStats(cat.id);
          return (
            <div key={cat.id} className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl group hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <cat.icon size={18} className={cn(cat.color, "opacity-50 group-hover:opacity-100 transition-opacity")} />
                {stats.count > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {stats.count}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{cat.id}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white">{stats.count}</span>
                {stats.critical + stats.high > 0 && (
                  <span className="text-[10px] font-bold text-rose-500">
                    +{stats.critical + stats.high} risk
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vulnerability Relationship Graph */}
      <VulnerabilityGraph findings={findings} />

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Sidebar Findings List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Threat Index</h3>
              <span className={cn("text-2xl font-mono font-bold", scoreColor)}>{audit.score}</span>
            </div>
            
            <div className="space-y-2">
              {findings.map((finding, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFinding(i)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 group cursor-pointer",
                    activeFinding === i 
                      ? "bg-zinc-800 border-zinc-700 shadow-lg" 
                      : "bg-transparent border-transparent hover:bg-zinc-900/50 hover:border-zinc-800"
                  )}
                >
                  <div className={cn(
                    "shrink-0 w-2 h-2 rounded-full mt-1.5 shadow-[0_0_8px_currentColor]",
                    finding.severity === "Critical" ? "text-rose-500" :
                    finding.severity === "High" ? "text-orange-500" :
                    finding.severity === "Medium" ? "text-amber-500" : "text-emerald-500"
                  )} />
                  <div className="flex-1 overflow-hidden">
                    <p className={cn(
                      "text-sm font-bold transition-colors mb-1",
                      activeFinding === i ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                    )}>
                      {finding.type}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter", getSeverityStyles(finding.severity))}>
                        {finding.severity}
                      </span>
                      {finding.file && (
                        <span className="text-[10px] text-zinc-600 font-mono truncate max-w-[120px]">
                          {finding.file}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className={cn("mt-1 transition-transform", activeFinding === i ? "text-white rotate-90" : "text-zinc-700")} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Finding Detail Display */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {currentFinding ? (
              <motion.div
                key={activeFinding}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Finding Summary */}
                <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Shield size={120} />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={cn("px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border", getSeverityStyles(currentFinding.severity))}>
                        {currentFinding.severity}
                      </span>
                      <h2 className="text-2xl font-bold text-white">{currentFinding.type}</h2>
                      {currentFinding.confidence && (
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                          currentFinding.confidence === "High" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                          currentFinding.confidence === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                          "bg-zinc-800 text-zinc-500 border border-zinc-700"
                        )}>
                          <Zap size={10} fill="currentColor" />
                          {currentFinding.confidence} Confidence
                        </div>
                      )}

                      {/* Phase 9 Taxonomy Badges */}
                      {currentFinding.owasp && (
                        <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {currentFinding.owasp}
                        </div>
                      )}
                      {currentFinding.cwe && (
                        <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {currentFinding.cwe}
                        </div>
                      )}
                      {currentFinding.exploitability && (
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                          currentFinding.exploitability === "Critical" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                          currentFinding.exploitability === "High" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                          currentFinding.exploitability === "Moderate" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                          "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        )}>
                          Exploitability: {currentFinding.exploitability}
                        </div>
                      )}
                    </div>

                    <p className="text-zinc-400 leading-relaxed text-lg">
                      &quot;{currentFinding.description}&quot;
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Affected Module</p>
                        <p className="text-xs font-mono text-zinc-300 break-all">{currentFinding.file || "Global Context"}</p>
                      </div>
                      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Line Number</p>
                        <p className="text-xs font-mono text-zinc-300">Approximation: L{currentFinding.line || "??"}</p>
                      </div>
                      {currentFinding.affectedComponent && (
                        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl sm:col-span-2">
                          <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Affected Component</p>
                          <p className="text-xs font-medium text-zinc-300">{currentFinding.affectedComponent}</p>
                        </div>
                      )}
                    </div>

                    {currentFinding.attackScenario && (
                      <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2 text-rose-500">
                          <Target size={16} />
                          <p className="text-[10px] font-bold uppercase tracking-widest">Potential Attack Scenario</p>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          &quot;{currentFinding.attackScenario}&quot;
                        </p>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {currentFinding.executiveRisk && (
                        <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-3 text-zinc-500">
                            <Briefcase size={16} />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Executive Risk</p>
                          </div>
                          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                            {currentFinding.executiveRisk}
                          </p>
                        </div>
                      )}
                      {currentFinding.whyItMatters && (
                        <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                          <div className="flex items-center gap-2 mb-3 text-zinc-500">
                            <Info size={16} />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Why This Matters</p>
                          </div>
                          <p className="text-sm text-zinc-400 leading-relaxed italic">
                            {currentFinding.whyItMatters}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Explainability Tabs */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden">
                  <div className="flex border-b border-zinc-800">
                    {[
                      { id: "developer", label: "Developer", icon: Code2 },
                      { id: "beginner", label: "Beginner", icon: BookOpen },
                      { id: "business", label: "Business", icon: Briefcase },
                      { id: "validation", label: "Validation", icon: ShieldCheck },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer",
                          activeTab === tab.id 
                            ? "bg-zinc-800 text-white" 
                            : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/80"
                        )}
                      >
                        <tab.icon size={16} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {activeTab === "developer" && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                <Code2 size={16} className="text-emerald-500" /> 
                                Technical Remediation
                              </h4>
                              
                              <div className="grid gap-4 min-w-0">
                                {currentFinding.vulnerableCode && (
                                  <div>
                                    <p className="text-[10px] font-bold text-rose-500 uppercase mb-2 ml-1">Vulnerable</p>
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 font-mono text-xs leading-relaxed text-zinc-500 overflow-x-auto relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent overflow-hidden">
                                      <pre className="opacity-70 whitespace-pre-wrap break-all">{currentFinding.vulnerableCode}</pre>
                                      <div className="absolute top-0 right-0 p-3">
                                        <AlertTriangle size={14} className="text-rose-500/30" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {currentFinding.structuredRemediation ? (
                                  <div className="space-y-4">
                                    <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                                      <p className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Immediate Fix</p>
                                      <p className="text-sm text-zinc-300">{currentFinding.structuredRemediation.immediateFix}</p>
                                    </div>
                                    <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                      <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Recommended Pattern</p>
                                      <p className="text-sm text-zinc-400 mb-4">{currentFinding.structuredRemediation.recommendedPattern}</p>
                                      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto relative group/code scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent overflow-hidden">
                                        <pre className="whitespace-pre-wrap break-all">{currentFinding.remediation}</pre>
                                        <button 
                                          onClick={() => navigator.clipboard.writeText(currentFinding.remediation)}
                                          className="absolute top-2 right-2 p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-white opacity-0 group-hover/code:opacity-100 transition-all"
                                        >
                                          <CheckCircle2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                      <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Validation</p>
                                        <p className="text-xs text-zinc-400">{currentFinding.structuredRemediation.validationRecommendation}</p>
                                      </div>
                                      <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Regression Prevention</p>
                                        <p className="text-xs text-zinc-400">{currentFinding.structuredRemediation.regressionProtection}</p>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase mb-2 ml-1">Remediated</p>
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto relative group/code scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent overflow-hidden">
                                      <pre className="whitespace-pre-wrap break-all">{currentFinding.remediation}</pre>
                                      <button 
                                        onClick={() => navigator.clipboard.writeText(currentFinding.remediation)}
                                        className="absolute top-2 right-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white opacity-0 group-hover/code:opacity-100 transition-all"
                                      >
                                        <CheckCircle2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex gap-3">
                              <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                              <p className="text-xs text-zinc-400">
                                Validation: Remediation bypasses unsafe patterns and enforces standard secure configuration.
                              </p>
                            </div>
                          </div>
                        )}

                        {activeTab === "beginner" && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                              <BookOpen size={16} className="text-blue-500" />
                              What does this mean?
                            </h4>
                            <p className="text-zinc-400 leading-relaxed">
                              Think of this like leaving your front door unlocked. Even if nobody comes in today, anyone walking by could enter your house. We recommend following the fix suggested in the Developer tab to lock this door.
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                                <p className="text-[10px] font-bold text-zinc-500 mb-1">RISK LEVEL</p>
                                <p className="text-sm font-bold text-white">{currentFinding.severity}</p>
                              </div>
                              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                                <p className="text-[10px] font-bold text-zinc-500 mb-1">URGENCY</p>
                                <p className="text-sm font-bold text-white">Immediate Action</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab === "business" && (
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                              <Briefcase size={16} className="text-amber-500" />
                              Strategic Impact
                            </h4>
                            <p className="text-zinc-400 leading-relaxed">
                              {currentFinding.impact || "This vulnerability poses a significant risk to data integrity and user trust. Remediation is required to ensure compliance with security standards (e.g., SOC2, GDPR) and prevent potential financial liability."}
                            </p>
                            <ul className="space-y-3 pt-4">
                              {[
                                "Potential for data breach or service disruption",
                                "Impact on regulatory compliance and insurance",
                                "Required engineering hours for mitigation: ~2-4h"
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs text-zinc-500">
                                  <ArrowRight size={12} className="text-zinc-700" /> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {activeTab === "validation" && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                                <ShieldCheck size={16} className="text-blue-400" />
                                Security Validation
                              </h4>
                              <div className="flex items-center gap-2">
                                {currentFinding.validationTest && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                    <Activity size={10} />
                                    Regression Ready
                                  </span>
                                )}
                                {currentFinding.testFramework && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {currentFinding.testFramework}
                                  </span>
                                )}
                              </div>
                            </div>

                            {currentFinding.exploitabilityReasoning && (
                              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Exploitability Reasoning</p>
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                  {currentFinding.exploitabilityReasoning}
                                </p>
                              </div>
                            )}

                            {currentFinding.validationTest ? (
                              <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2 ml-1">Defensive Validation Test</p>
                                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto relative group/test scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent overflow-hidden">
                                  <pre className="whitespace-pre-wrap break-all">{currentFinding.validationTest}</pre>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(currentFinding.validationTest!)}
                                    className="absolute top-2 right-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white opacity-0 group-hover/test:opacity-100 transition-all"
                                  >
                                    <CheckCircle2 size={14} />
                                  </button>
                                </div>
                                <p className="text-[10px] text-zinc-600 mt-3">
                                  Note: These tests are for defensive validation and should be run in a safe, isolated environment.
                                </p>
                              </div>
                            ) : (
                              <div className="p-8 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
                                <p className="text-sm text-zinc-500">No validation test generated for this finding.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center p-12 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl">
                <ShieldCheck size={48} className="text-zinc-800 mb-4" />
                <p className="text-zinc-500">Select a finding from the threat index to view detailed intelligence.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
