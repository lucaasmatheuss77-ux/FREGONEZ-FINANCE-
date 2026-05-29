"use client";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({ children, variant = "primary", size = "md", loading, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 justify-center",
        variant === "primary" && "bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 text-white shadow-btn hover:shadow-btn-hover hover:scale-[1.02] active:scale-[0.98]",
        variant === "secondary" && "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300",
        variant === "ghost" && "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
        variant === "danger" && "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100",
        variant === "gold" && "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-gold-sm hover:shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:scale-[1.02]",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        (disabled || loading) && "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-btn",
        className
      )}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
