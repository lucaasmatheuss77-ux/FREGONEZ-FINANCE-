"use client";
import { Bell } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const today = new Date();
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="flex items-center justify-between px-4 pt-6 pb-2">
      <div>
        <h1 className="text-2xl font-black text-gradient">{title}</h1>
        {subtitle ? (
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        ) : (
          <p className="text-xs text-gray-400 mt-0.5">
            {dayNames[today.getDay()]}, {formatDate(today)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-purple-400 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(124,58,237,0.4)]">
          LF
        </div>
      </div>
    </div>
  );
}
