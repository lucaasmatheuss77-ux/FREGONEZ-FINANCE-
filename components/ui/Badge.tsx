import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "forest" | "blue" | "green" | "gold" | "red" | "gray" | "cyan";
  className?: string;
}

const variants = {
  forest: "bg-[#EEF2EE] text-[#1A2E1A] border-[#B8CFBA]",
  blue:   "bg-blue-50 text-blue-700 border-blue-200",
  green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  gold:   "bg-[#F0DFA8] text-[#8A6418] border-[#D6C080]",
  red:    "bg-red-50 text-red-600 border-red-200",
  gray:   "bg-[#EDE8E1] text-[#5C5449] border-[#D6D0C8]",
  cyan:   "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export function Badge({ children, variant = "forest", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
}
