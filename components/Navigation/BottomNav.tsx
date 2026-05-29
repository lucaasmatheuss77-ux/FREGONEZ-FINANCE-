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
      <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
        <div className="bg-white/90 backdrop-blur-xl border border-purple-100 shadow-[0_-4px_40px_rgba(217,119,6,0.12)] rounded-2xl max-w-md mx-auto">
          <div className="flex items-center justify-around px-1 py-2 relative">
            {navItems.slice(0, 2).map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className="flex-1">
                  <div className={cn(
                    "flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all duration-200",
                    active ? "text-amber-600" : "text-gray-400 hover:text-gray-600"
                  )}>
                    <div className={cn("p-1.5 rounded-xl transition-all", active && "bg-amber-50")}>
                      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                    </div>
                    <span className={cn("text-[10px] font-medium", active ? "text-amber-600" : "text-gray-400")}>{label}</span>
                    {active && <div className="w-1 h-1 rounded-full bg-amber-500" />}
                  </div>
                </Link>
              );
            })}

            {/* Voice button — center elevated */}
            <div className="flex-1 flex justify-center -mt-7">
              <button
                onClick={() => setVoiceOpen(true)}
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-400 flex items-center justify-center shadow-[0_4px_24px_rgba(217,119,6,0.45)] hover:shadow-[0_8px_40px_rgba(217,119,6,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 glow-animate border-4 border-white"
              >
                <Mic size={26} className="text-white" strokeWidth={2.5} />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full border-2 border-white animate-pulse" />
              </button>
            </div>

            {navItems.slice(2).map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} className="flex-1">
                  <div className={cn(
                    "flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all duration-200",
                    active ? "text-amber-600" : "text-gray-400 hover:text-gray-600"
                  )}>
                    <div className={cn("p-1.5 rounded-xl transition-all", active && "bg-amber-50")}>
                      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                    </div>
                    <span className={cn("text-[10px] font-medium", active ? "text-amber-600" : "text-gray-400")}>{label}</span>
                    {active && <div className="w-1 h-1 rounded-full bg-amber-500" />}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {voiceOpen && <VoiceButton onClose={() => setVoiceOpen(false)} />}
    </>
  );
}
