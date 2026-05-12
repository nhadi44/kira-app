"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusSquare, 
  FileText, 
  Settings, 
  Shield,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "New Scan", icon: PlusSquare, href: "/dashboard/new-scan" },
  { label: "Audit Ledger", icon: FileText, href: "/dashboard/ledger" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-emerald-500/10 p-2 rounded-lg">
              <Shield className="text-emerald-500" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">KIRA</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  pathname === item.href 
                    ? "bg-zinc-900 text-emerald-500 border border-zinc-800" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-colors",
                  pathname === item.href ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-300"
                )} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 border border-zinc-800"
                  }
                }}
              />
              <span className="text-sm font-medium text-zinc-300">Profile</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
