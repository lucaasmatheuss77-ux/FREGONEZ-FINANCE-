"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, CheckSquare, TrendingUp, BarChart3, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { VoiceButton } from "@/components/VoiceInput/VoiceButton";

const navItems = [
  { href: "/",          icon: LayoutDashboard, label: "Início"    },
  { href: "/tarefas",   icon: CheckSquare,     label: "Tarefas"   },
  { href: "/agenda",    icon: Calendar,        label: "Agenda"    },
  { href: "/financeiro",icon: TrendingUp,      label: "Finanças"  },
  { href: "/relatorios",icon: BarChart3,       label: "Relatórios"},
];

export function BottomNav() {
  const pathname = usePathname();
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <>
      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-safe-area-inset-bottom pb-3">
        <div className="bg-white/94 backdrop-blur-xl border border-[#D6D0C8] shadow-[0_-4px_32px_rgba(27,58,27,0.10)] rounded-2xl max-w-md mx-auto">
          <div className="flex items-center justify-around px-2 h-16">
            {/* Left 2 items */}
            {navItems.slice(0, 2).map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className="flex-1">
                  <div className={cn(
                    "flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all duration-200",
                    active ? "text-[#1A2E1A]" : "text-[#9C968E] hover:text-gray-600"
                  )}>
                    <div className={cn("p-1.5 rounded-xl transition-all", active && "bg-[#EEF2EE]")}>
                      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                    </div>
                    <span className={cn("text-[10px] font-semibold leading-none", active ? "text-[#1A2E1A]" : "text-[#9C968E]")}>
                      {label}
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Center — empty space for FAB */}
            <div className="flex-shrink-0 w-16" />

            {/* Right 3 items */}
            {navItems.slice(2).map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className="flex-1">
                  <div className={cn(
                    "flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all duration-200",
                    active ? "text-[#1A2E1A]" : "text-[#9C968E] hover:text-gray-600"
                  )}>
                    <div className={cn("p-1.5 rounded-xl transition-all", active && "bg-[#EEF2EE]")}>
                      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                    </div>
                    <span className={cn("text-[10px] font-semibold leading-none", active ? "text-[#1A2E1A]" : "text-[#9C968E]")}>
                      {label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Voice FAB — floating, perfectly centered above nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none max-w-md mx-auto">
        <div className="flex justify-center pb-[52px]">
          <button
            onClick={() => setVoiceOpen(true)}
            className="pointer-events-auto relative w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 glow-animate"
            style={{
              background: "linear-gradient(135deg, #8A6418, #B8882A, #D4A84B)",
              boxShadow: "0 -2px 0 rgba(255,255,255,0.9), 0 6px 28px rgba(176,125,16,0.55), 0 2px 8px rgba(27,58,27,0.20)",
              border: "3.5px solid white",
            }}
          >
            <Mic size={24} className="text-white" strokeWidth={2.5} />
            {/* Live indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#1A2E1A] rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </span>
          </button>
        </div>
      </div>

      {voiceOpen && <VoiceButton onClose={() => setVoiceOpen(false)} />}
    </>
  );
}
