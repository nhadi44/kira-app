"use client";

import { useTransition, useState } from "react";
import { processAudit } from "@/actions/audit";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Loader2, UploadCloud, Code as CodeIcon, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";

interface AuditFormProps {
  initialData?: {
    projectName: string;
    codeSnippet: string;
  };
}

export function AuditForm({ initialData }: AuditFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [projectName, setProjectName] = useState(initialData?.projectName || "");
  const [codeSnippet, setCodeSnippet] = useState(initialData?.codeSnippet || "");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await processAudit(formData);
      if (result.success && result.auditId) {
        router.push(`/dashboard/report/${result.auditId}`);
      } else if (result.error) {
        setErrorMessage(typeof result.error === 'string' ? result.error : "Validation failed");
        setShowErrorModal(true);
      }
    });
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">Project Name</label>
        <input 
          name="projectName"
          required
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g. Authentication Middleware"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <CodeIcon size={16} />
          Code Snippet (Max 50KB)
        </label>
        <div className="relative group">
          <textarea 
            name="codeSnippet"
            required
            rows={15}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-4 text-zinc-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
          />
          <div className="absolute top-4 right-4 text-zinc-600 group-hover:text-zinc-400 transition-colors pointer-events-none">
            <UploadCloud size={20} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <button 
          type="submit"
          disabled={isPending}
          className="w-full lg:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Deep Scan Running...</span>
            </>
          ) : (
            <>
              <Shield size={20} />
              <span>Initiate Audit</span>
            </>
          )}
        </button>
        <p className="text-[10px] text-zinc-500 leading-relaxed max-w-md">
          By initiating an audit, you agree to our <Link href="/terms" className="text-zinc-300 hover:text-emerald-500 underline underline-offset-4">Terms</Link> and <Link href="/privacy" className="text-zinc-300 hover:text-emerald-500 underline underline-offset-4">Privacy Policy</Link>. KIRA only stores audit summaries and findings; your source code is never permanently retained.
        </p>
      </div>

      <Modal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        title="Validation Error"
      >
        <div className="space-y-6 text-center">
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-full w-fit mx-auto">
            <AlertCircle className="text-rose-500" size={32} />
          </div>
          <p className="text-zinc-400 leading-relaxed">
            {errorMessage}
          </p>
          <button 
            type="button"
            onClick={() => setShowErrorModal(false)}
            className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all"
          >
            Dismiss
          </button>
        </div>
      </Modal>
    </motion.form>
  );
}
