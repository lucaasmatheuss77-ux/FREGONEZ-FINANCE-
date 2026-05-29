import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "blue" | "green" | "yellow" | "red" | "gray" | "cyan";
  className?: string;
}

const variants = {
  purple: "bg-violet-50 text-violet-700 border-violet-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  yellow: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-600 border-red-200",
  gray: "bg-gray-100 text-gray-600 border-gray-200",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export function Badge({ children, variant = "purple", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
}
