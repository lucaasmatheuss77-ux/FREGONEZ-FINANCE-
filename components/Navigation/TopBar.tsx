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
    <div className="flex items-center justify-between px-4 pt-6 pb-3">
      <div>
        <h1 className="text-2xl font-black text-gradient">{title}</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">
          {subtitle || `${dayNames[today.getDay()]}, ${formatDate(today)}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-violet-600 hover:border-violet-200 transition-all relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-neon-sm">
          LF
        </div>
      </div>
    </div>
  );
}
