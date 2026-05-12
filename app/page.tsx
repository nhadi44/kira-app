"use client";

import Link from "next/link";
import { 
  Shield, 
  Lock, 
  Zap, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  FileSearch,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Deep Security Scan",
    description: "Recursive project-level analysis detecting Broken Access Control, Injection, and PII leakage.",
    icon: Search,
  },
  {
    title: "Explainable Findings",
    description: "Findings translated for developers, beginners, and business stakeholders with impact analysis.",
    icon: Shield,
  },
  {
    title: "Remediation Previews",
    description: "Secure code suggestions with before/after diffs to patch vulnerabilities instantly.",
    icon: Code2,
  },
  {
    title: "Integrity Ledger",
    description: "Persistent audit history with exportable professional PDF reports for compliance.",
    icon: ShieldCheck,
  }
];

const vulnerabilityTypes = [
  "Broken Access Control",
  "Hardcoded Secrets",
  "Injection Vulnerabilities",
  "Insecure Configurations",
  "PII Exposure"
];

const steps = [
  { step: "01", title: "Upload Project", description: "Securely upload your codebase archive (.zip, .rar) to our encrypted intake portal." },
  { step: "02", title: "KIRA Deep Scan", description: "Our AI engine performs recursive analysis across multiple files and dependencies." },
  { step: "03", title: "Receive Insights", description: "Get a professional security report with explainable findings and remediation code." }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-500">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 px-6 lg:px-12 h-20 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <Shield className="text-emerald-500" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">KIRA</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Capabilities</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Workflow</Link>
          <Link href="/dashboard" className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">Platform</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white px-4 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/dashboard/new-scan" 
            className="bg-zinc-100 text-zinc-950 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-white transition-all active:scale-95"
          >
            Start Audit
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-48 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                <Zap size={12} className="fill-emerald-500" /> Enterprise Security Intelligence
              </div>
              <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
                Audit your code <span className="text-zinc-600 block">before attackers do.</span>
              </h1>
              <p className="text-lg lg:text-xl text-zinc-400 max-w-lg leading-relaxed font-medium">
                KIRA performs early-stage AI security audits, helping teams identify critical vulnerabilities with explainable insights and instant remediation.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link 
                  href="/dashboard/new-scan" 
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] group"
                >
                  Start Scan <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                  View Platform
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative lg:block hidden"
            >
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-600">AUDIT_SESSION_LIVE</div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                        <AlertTriangle className="text-rose-500" size={14} />
                        SQL Injection Detected
                      </div>
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">HIGH</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 w-[85%]" />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Lock className="text-amber-500" size={14} />
                        Hardcoded JWT Secret
                      </div>
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">MEDIUM</span>
                    </div>
                    <div className="bg-zinc-900 p-3 rounded-lg font-mono text-[10px] text-emerald-500">
                      - const secret = &quot;vulnerable_key_123&quot;;<br/>
                      + const secret = process.env.JWT_SECRET;
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-zinc-950 border border-emerald-500/30 p-6 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10" />
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                  <span className="text-emerald-500 font-bold text-xs font-mono relative z-10">92</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Integrity Score</p>
                  <p className="text-sm font-bold text-white">Project Secure</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Capability Section */}
        <section id="features" className="py-32 bg-zinc-900/20 border-y border-zinc-900 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter text-white">Security intelligence <br/> designed for developers.</h2>
                <p className="text-zinc-500 max-w-md">Professional security tooling that speaks your language and integrates into your existing workflow.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {vulnerabilityTypes.map((type) => (
                  <span key={type} className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition-all group"
                >
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl w-fit mb-6 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                    <feature.icon className="text-zinc-400 group-hover:text-emerald-500 transition-colors" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter text-white">Explainable Audit Workflow</h2>
              <p className="text-zinc-500">Go from uploaded archive to security intelligence in three steps.</p>
            </div>

            <div className="space-y-12">
              {steps.map((step, i) => (
                <div key={step.title} className="flex gap-8 group">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 font-mono font-bold group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      {step.step}
                    </div>
                    {i !== steps.length - 1 && <div className="flex-1 w-px bg-zinc-800" />}
                  </div>
                  <div className="pb-12">
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-32 px-6 border-t border-zinc-900">
          <div className="max-w-5xl mx-auto rounded-3xl bg-zinc-900/50 border border-zinc-800 p-12 lg:p-24 text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
            
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter text-white max-w-2xl mx-auto">
              Start auditing your applications before attackers do.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/dashboard/new-scan" 
                className="w-full sm:w-auto bg-white text-zinc-950 px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition-all shadow-xl"
              >
                Launch KIRA Dashboard
              </Link>
              <Link 
                href="/dashboard" 
                className="w-full sm:w-auto text-white px-10 py-5 rounded-2xl text-xl font-bold border border-zinc-800 hover:bg-zinc-800 transition-all"
              >
                Create Account
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 pt-10">
              <div className="text-center">
                <p className="text-2xl font-mono font-bold text-white">5k+</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Audits Performed</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-center">
                <p className="text-2xl font-mono font-bold text-white">12k+</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Threats Detected</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-center">
                <p className="text-2xl font-mono font-bold text-white">~45s</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Avg Scan Time</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 lg:px-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="text-emerald-500" size={24} />
              <span className="text-xl font-bold tracking-tight text-white">KIRA</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              Engineering trust through AI-powered security intelligence. Built for modern infrastructure teams and developers.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">API Documentation</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Security Guide</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">GitHub Repository</Link></li>
              <li><Link href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
          <span>© 2026 Knowledge Integrity & Risk Auditor. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
