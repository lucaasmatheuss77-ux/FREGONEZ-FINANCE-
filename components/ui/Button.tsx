"use client";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 justify-center",
        variant === "primary" && "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-[0.98]",
        variant === "secondary" && "bg-white/5 border border-white/10 text-white hover:bg-white/10",
        variant === "ghost" && "text-gray-400 hover:text-white hover:bg-white/5",
        variant === "danger" && "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30",
        variant === "gold" && "bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-[1.02]",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        (disabled || loading) && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
