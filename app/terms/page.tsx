"use client";

import { Shield, Scale, AlertCircle, FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
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
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <Scale size={12} /> Compliance & Legal
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white">Terms of Service</h1>
          </div>

          <section className="space-y-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="text-amber-500" size={20} /> Platform Limitations
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  KIRA is an AI-assisted security auditing platform. While we strive for precision, our findings are generated via Large Language Models and do not guarantee the detection of all possible vulnerabilities. KIRA is not a replacement for professional penetration testing or comprehensive security consulting.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="text-emerald-500" size={20} /> User Responsibility
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Users are responsible for validating and implementing any remediation suggestions provided by KIRA. We do not accept liability for security incidents or data breaches occurring on systems audited using our platform.
                </p>
              </div>
            </div>

            <div className="space-y-8 p-12 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
              <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise Clauses</h2>
              
              <div className="space-y-6">
                {[
                  { 
                    title: "Transient Processing", 
                    content: "Uploaded source code is processed in ephemeral, isolated environments. KIRA does not claim ownership of any code uploaded and automatically deletes all project files upon completion of the audit session." 
                  },
                  { 
                    title: "Advisory Nature", 
                    content: "The Integrity Score and findings provided by KIRA are advisory in nature. They represent an AI-driven assessment of risk and should be used as one component of a broader security posture." 
                  },
                  { 
                    title: "Acceptable Use", 
                    content: "Users may only upload code for which they have the legal right to audit. KIRA prohibits the use of the platform for illegal activities, reverse engineering proprietary systems without authorization, or attempting to bypass platform security measures." 
                  }
                ].map((item) => (
                  <div key={item.title} className="space-y-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">{item.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-2xl border-l-4 border-l-amber-500/50">
              <p className="text-xs text-zinc-500 leading-relaxed">
                <span className="font-bold text-amber-500 uppercase mr-2">Disclaimer:</span>
                KIRA DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;.
              </p>
            </div>
          </section>

          <footer className="pt-24 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <span>© 2026 KIRA PLATFORM. Last Updated: May 2026.</span>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/" className="hover:text-white transition-colors">Back to Home</Link>
            </div>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
