"use client";

import { useState } from "react";
import { ProjectUploader } from "@/components/dashboard/ProjectUploader";
import { AuditForm } from "@/components/dashboard/AuditForm";
import { processProjectAudit } from "@/actions/audit";
import { useRouter } from "react-router-dom"; // Wait, this is Next.js
import { useRouter as useNextRouter } from "next/navigation";
import { Shield, FileCode, FolderArchive, Zap, ShieldAlert, Rocket, Microscope } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScanMode } from "@/lib/validations/audit";
import { Modal } from "@/components/ui/Modal";

type ScanType = "snippet" | "project";

export default function NewScanPage() {
  const [scanType, setScanType] = useState<ScanType>("project");
  const [scanMode, setScanMode] = useState<ScanMode>("Deep");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [projectName, setProjectName] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const router = useNextRouter();

  const handleProjectUpload = (file: File) => {
    setPendingFile(file);
    setShowNameModal(true);
  };

  const executeProjectAudit = async () => {
    if (!pendingFile) return;
    
    setIsProcessing(true);
    setShowNameModal(false);
    
    const formData = new FormData();
    formData.append("projectArchive", pendingFile);
    formData.append("projectName", projectName.trim());
    formData.append("scanMode", scanMode);

    try {
      const result = await processProjectAudit(formData);
      if (result.success && result.auditId) {
        router.push(`/dashboard/scan/${result.auditId}`);
      } else {
        setErrorMessage(result.error || "Failed to process project audit");
        setShowErrorModal(true);
      }
    } catch (e) {
      setErrorMessage("An unexpected error occurred during scanning");
      setShowErrorModal(true);
    } finally {
      setIsProcessing(false);
      setPendingFile(null);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Zap size={12} className="fill-emerald-500" /> Security Intelligence Unit
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Initiate Audit Session</h1>
          <p className="text-zinc-500 max-w-lg">Choose your audit vector. KIRA supports individual code snippets or full project-level repository analysis.</p>
        </div>
      </div>

      {/* Selector */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="grid grid-cols-2 gap-4 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl w-full md:max-w-md">
          <button 
            onClick={() => setScanType("project")}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-sm font-bold",
              scanType === "project" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <FolderArchive size={18} />
            Project Scan
          </button>
          <button 
            onClick={() => setScanType("snippet")}
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-sm font-bold",
              scanType === "snippet" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <FileCode size={18} />
            Snippet Scan
          </button>
        </div>

        {scanType === "project" && (
          <div className="grid grid-cols-2 gap-4 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl w-full md:max-w-xs">
            <button 
              onClick={() => setScanMode("Quick")}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider",
                scanMode === "Quick" ? "bg-emerald-500/10 text-emerald-500" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              <Rocket size={14} />
              Quick
            </button>
            <button 
              onClick={() => setScanMode("Deep")}
              className={cn(
                "flex items-center justify-center gap-2 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider",
                scanMode === "Deep" ? "bg-emerald-500/10 text-emerald-500" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              <Microscope size={14} />
              Deep
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {scanType === "project" ? (
          <motion.div 
            key="project"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Project Intake Portal</h3>
              <ProjectUploader 
                onUpload={handleProjectUpload} 
                isProcessing={isProcessing} 
                onError={(msg) => {
                  setErrorMessage(msg);
                  setShowErrorModal(true);
                }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="snippet"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Snippet Analysis Buffer</h3>
              <AuditForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex gap-4">
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl h-fit">
            <ShieldAlert className="text-amber-500" size={20} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sanitization Protocol</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              KIRA automatically strips binary files, node_modules, and git history during intake. Only source code and configurations are analyzed to ensure privacy and efficiency.
            </p>
          </div>
        </div>
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex gap-4">
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl h-fit">
            <Zap className="text-emerald-500" size={20} />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explainable AI</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Every finding includes a technical breakdown for developers and a business impact assessment for stakeholders, ensuring transparency across the organization.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={showNameModal} 
        onClose={() => setShowNameModal(false)}
        title="Project Configuration"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Project Name</label>
            <input 
              autoFocus
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && executeProjectAudit()}
              placeholder="e.g. My Secure App"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => setShowNameModal(false)}
              className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={executeProjectAudit}
              disabled={!projectName.trim()}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl font-bold transition-all shadow-lg",
                projectName.trim() 
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20" 
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              )}
            >
              Start Scan
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        title="Scan Error"
      >
        <div className="space-y-6 text-center">
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-full w-fit mx-auto">
            <ShieldAlert className="text-rose-500" size={32} />
          </div>
          <p className="text-zinc-400 leading-relaxed">
            {errorMessage}
          </p>
          <button 
            onClick={() => setShowErrorModal(false)}
            className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all"
          >
            Dismiss
          </button>
        </div>
      </Modal>
    </div>
  );
}
