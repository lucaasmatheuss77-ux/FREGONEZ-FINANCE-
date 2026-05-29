"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, CheckSquare, TrendingUp, BarChart3, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { VoiceButton } from "@/components/VoiceInput/VoiceButton";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Início" },
  { href: "/tarefas", icon: CheckSquare, label: "Tarefas" },
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/financeiro", icon: TrendingUp, label: "Finanças" },
  { href: "/relatorios", icon: BarChart3, label: "Relatórios" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 px-2 pb-2">
        <div className="glass-card border border-purple-500/20 shadow-[0_0_40px_rgba(124,58,237,0.15)] rounded-2xl">
          <div className="flex items-center justify-around px-1 py-2 relative">
            {navItems.slice(0, 2).map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="flex-1">
                <div className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all duration-200",
                  pathname === href
                    ? "text-purple-400"
                    : "text-gray-500 hover:text-gray-300"
                )}>
                  <div className={cn(
                    "p-1.5 rounded-lg transition-all",
                    pathname === href && "bg-purple-500/20 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                  )}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-medium">{label}</span>
                  {pathname === href && (
                    <div className="w-1 h-1 rounded-full bg-purple-400" />
                  )}
                </div>
              </Link>
            ))}

            {/* Voice button center */}
            <div className="flex-1 flex justify-center -mt-6">
              <button
                onClick={() => setVoiceOpen(true)}
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:shadow-[0_0_50px_rgba(124,58,237,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 glow-animate"
              >
                <Mic size={28} className="text-white" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#0A0A14] animate-pulse" />
              </button>
            </div>

            {navItems.slice(2).map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className="flex-1">
                <div className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all duration-200",
                  pathname === href
                    ? "text-purple-400"
                    : "text-gray-500 hover:text-gray-300"
                )}>
                  <div className={cn(
                    "p-1.5 rounded-lg transition-all",
                    pathname === href && "bg-purple-500/20 shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                  )}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-medium">{label}</span>
                  {pathname === href && (
                    <div className="w-1 h-1 rounded-full bg-purple-400" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {voiceOpen && <VoiceButton onClose={() => setVoiceOpen(false)} />}
    </>
  );
}
