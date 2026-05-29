import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "blue" | "green" | "yellow" | "red" | "gray" | "cyan";
  className?: string;
}

const variants = {
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  red: "bg-red-500/20 text-red-300 border-red-500/30",
  gray: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

export function Badge({ children, variant = "purple", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
