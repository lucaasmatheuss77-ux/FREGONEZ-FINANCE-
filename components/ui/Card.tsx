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
        "bg-white rounded-2xl border border-purple-100 shadow-card transition-all duration-200",
        glow && "hover:shadow-card-hover hover:border-purple-200 hover:-translate-y-0.5",
        gold && "border-gold",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
