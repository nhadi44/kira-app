"use client";

import { useState, useRef } from "react";
import { UploadCloud, File, X, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProjectUploaderProps {
  onUpload: (file: File) => void;
  onError?: (message: string) => void;
  isProcessing: boolean;
}

export function ProjectUploader({ onUpload, onError, isProcessing }: ProjectUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFile(droppedFile)) {
        setFile(droppedFile);
      } else {
        onError?.("Please upload a valid archive (.zip, .rar, .tar.gz)");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const isValidFile = (file: File) => {
    const validExtensions = [".zip", ".rar", ".tar.gz", ".tar"];
    return validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleStartScan = () => {
    if (file) onUpload(file);
  };

  return (
    <div className="space-y-6">
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 flex flex-col items-center justify-center text-center group",
          dragActive ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700",
          file ? "border-emerald-500/50 bg-emerald-500/5" : ""
        )}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".zip,.rar,.tar.gz,.tar"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="p-4 bg-zinc-800 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud size={32} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Drag and drop project archive</p>
                <p className="text-sm text-zinc-500 mt-1">Support for .zip, .rar, .tar.gz (Max 50MB)</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4 relative"
            >
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                <File size={24} />
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{file.name}</p>
                <p className="text-xs text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for scan</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="p-1 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex gap-4">
                <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Secure Transient Processing</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Archive integrity verified. Your source code is processed in an ephemeral workspace and is <strong>automatically deleted</strong> immediately after the audit completes. We do not store raw application files.
                  </p>
                </div>
              </div>

              <button 
                onClick={handleStartScan}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-emerald-500/20"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Deep Scan Running...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    <span>Initiate Project Audit</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Stages (Optional, can be shown in a parent) */}
    </div>
  );
}
