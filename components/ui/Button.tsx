"use client";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "forest";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({ children, variant = "primary", size = "md", loading, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 justify-center",
        variant === "primary" && "bg-gradient-to-r from-[#8A6418] via-[#B8882A] to-[#D4A84B] text-white shadow-btn hover:shadow-btn-hover hover:scale-[1.02] active:scale-[0.98]",
        variant === "secondary" && "bg-white border border-[#D6D0C8] text-[#1A2E1A] hover:bg-[#F7F4EF] hover:border-[#B8CFBA]",
        variant === "ghost" && "text-[#1A2E1A] hover:text-[#0E1E0E] hover:bg-[#EEF2EE]",
        variant === "danger" && "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100",
        variant === "forest" && "bg-[#1A2E1A] text-white shadow-neon-sm hover:bg-[#0E1E0E] hover:scale-[1.02] active:scale-[0.98]",
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
