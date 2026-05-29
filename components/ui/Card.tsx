"use client";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  gold?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, glow, gold, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card p-4 transition-all duration-300",
        glow && "hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] hover:-translate-y-1",
        gold && "border-gold",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
