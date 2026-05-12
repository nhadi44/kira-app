"use client";

import { Shield, Lock, Trash2, EyeOff, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-500">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <header className="sticky top-0 z-50 px-6 lg:px-12 h-20 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <Shield className="text-emerald-500" size={24} />
          <span className="text-2xl font-bold tracking-tighter text-white uppercase">KIRA</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
          Platform Access
        </Link>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 lg:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white">Privacy Policy</h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl">
              At KIRA, we believe security intelligence should never come at the cost of your privacy. Our architecture is designed for transient processing, not data retention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit text-emerald-500">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Zero Retention Policy</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Uploaded source code and project archives are automatically deleted from our processing environment the moment your audit is completed. We do not store raw application files permanently.
              </p>
            </div>
            <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl w-fit text-blue-500">
                <EyeOff size={24} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">No AI Training</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Your proprietary codebase is never used to train or fine-tune our security models. We act only as a transient processor for your security intelligence.
              </p>
            </div>
          </div>

          <section className="space-y-12 pt-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white tracking-tight">What KIRA Stores</h2>
              <div className="grid gap-4">
                {[
                  { title: "Account Metadata", desc: "Basic profile information provided via Clerk for authentication and secure access." },
                  { title: "Audit Summary", desc: "Metadata about your scans, such as project name, timestamp, and integrity score." },
                  { title: "Security Findings", desc: "Sanitized vulnerability descriptions and remediation logic generated during audits." },
                ].map((item) => (
                  <div key={item.title} className="p-6 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex gap-6 items-start">
                    <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{item.title}</h4>
                      <p className="text-sm text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-rose-500 tracking-tight">What We NEVER Store</h2>
              <ul className="space-y-4 text-zinc-400">
                {[
                  "Uploaded source code and binary files.",
                  "Proprietary project archives or repositories.",
                  "Sensitive credentials discovered during transient scanning.",
                  "Private business logic or proprietary algorithms."
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-12 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-6">
              <h2 className="text-3xl font-bold text-white tracking-tight">Security Standards</h2>
              <p className="text-zinc-500 leading-relaxed italic">
                &quot;Our commitment to security extends beyond the code we analyze. Every KIRA audit is executed in an isolated, encrypted workspace that is wiped clean upon completion.&quot;
              </p>
              <div className="flex flex-wrap gap-8 pt-6 border-t border-zinc-800">
                <div>
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1">Encryption</p>
                  <p className="text-sm text-white">TLS 1.3 / AES-256</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1">Authentication</p>
                  <p className="text-sm text-white">Clerk Enterprise</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1">Isolation</p>
                  <p className="text-sm text-white">Transient Workspace</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-24 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <span>© 2026 KIRA PLATFORM. Last Updated: May 2026.</span>
            <div className="flex gap-8">
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/" className="hover:text-white transition-colors">Back to Home</Link>
            </div>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
