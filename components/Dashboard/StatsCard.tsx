import { Card } from "@/components/ui/Card";
import { cn, formatCurrency } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  isCurrency?: boolean;
  color?: "purple" | "blue" | "green" | "gold" | "red" | "cyan";
  subtitle?: string;
}

const colorMap = {
  purple: {
    icon: "text-purple-400",
    bg: "bg-purple-500/20",
    glow: "shadow-[0_0_20px_rgba(124,58,237,0.15)]",
    border: "border-purple-500/20",
    trend: "text-purple-400",
  },
  blue: {
    icon: "text-blue-400",
    bg: "bg-blue-500/20",
    glow: "shadow-[0_0_20px_rgba(37,99,235,0.15)]",
    border: "border-blue-500/20",
    trend: "text-blue-400",
  },
  green: {
    icon: "text-emerald-400",
    bg: "bg-emerald-500/20",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    border: "border-emerald-500/20",
    trend: "text-emerald-400",
  },
  gold: {
    icon: "text-yellow-400",
    bg: "bg-yellow-500/20",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    border: "border-yellow-500/20",
    trend: "text-yellow-400",
  },
  red: {
    icon: "text-red-400",
    bg: "bg-red-500/20",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    border: "border-red-500/20",
    trend: "text-red-400",
  },
  cyan: {
    icon: "text-cyan-400",
    bg: "bg-cyan-500/20",
    glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    border: "border-cyan-500/20",
    trend: "text-cyan-400",
  },
};

export function StatsCard({ title, value, icon: Icon, trend, isCurrency, color = "purple", subtitle }: StatsCardProps) {
  const colors = colorMap[color];
  const displayValue = isCurrency && typeof value === "number" ? formatCurrency(value) : value;

  return (
    <Card className={cn("p-4 transition-all duration-300 hover:-translate-y-1", colors.glow, `border ${colors.border}`)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.bg)}>
          <Icon size={20} className={colors.icon} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full",
            trend >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          )}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-gray-400 text-xs font-medium mb-0.5">{title}</p>
      <p className="text-xl font-black text-white truncate">{displayValue}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </Card>
  );
}
