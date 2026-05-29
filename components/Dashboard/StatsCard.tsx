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
  purple: { icon: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  blue:   { icon: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100"   },
  green:  { icon: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-100" },
  gold:   { icon: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100"  },
  red:    { icon: "text-red-500",    bg: "bg-red-50",    border: "border-red-100"    },
  cyan:   { icon: "text-cyan-600",   bg: "bg-cyan-50",   border: "border-cyan-100"   },
};

export function StatsCard({ title, value, icon: Icon, trend, isCurrency, color = "purple", subtitle }: StatsCardProps) {
  const c = colorMap[color];
  const display = isCurrency && typeof value === "number" ? formatCurrency(value) : value;

  return (
    <Card className={cn("p-4 hover:-translate-y-0.5 transition-transform duration-200", c.border)} glow>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", c.bg)}>
          <Icon size={20} className={c.icon} strokeWidth={2} />
        </div>
        {trend !== undefined && (
          <div className={cn("flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-lg",
            trend >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          )}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-gray-400 text-xs font-medium mb-0.5">{title}</p>
      <p className="text-xl font-black text-gray-900 truncate">{display}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </Card>
  );
}
